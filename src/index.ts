import { Bot, InlineKeyboard, InputFile } from 'grammy';
import youtubeDl from 'youtube-dl-exec';
import ffmpegPath from 'ffmpeg-static';
import { unlink, mkdir, access } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import 'dotenv/config';

const token = process.env.BOT_TOKEN;
if (!token)
  throw new Error('Error: No se encontró el BOT_TOKEN en el archivo .env');

const bot = new Bot(token);

const userRequests = new Map<number, string>();

async function ensureDownloadFolder() {
  const folderPath = path.resolve('downloads');
  try {
    await access(folderPath);
  } catch {
    await mkdir(folderPath);
  }
  return folderPath;
}

bot.command('start', (ctx) => {
  ctx.reply(
    '👋 ¡Hola! Envíame:\n/mp4 [url] - Para video\n/mp3 [url] - Para audio',
  );
});

bot.command(['mp4', 'mp3'], async (ctx) => {
  const url = ctx.match;
  const command = ctx.message?.text?.split(' ')[0];

  if (!url)
    return ctx.reply(
      `❌ Falta el link. Ejemplo: ${command} https://youtube.com/...`,
    );

  userRequests.set(ctx.from!.id, url.toString());

  const keyboard = new InlineKeyboard();

  if (command === '/mp4') {
    keyboard
      .text('💎 Alta (1080p)', 'video_high')
      .row()
      .text('⚖️ Media (720p)', 'video_medium')
      .row()
      .text('📉 Baja (480p)', 'video_low');
    await ctx.reply('🎥 Elige la calidad del video:', {
      reply_markup: keyboard,
    });
  } else {
    keyboard
      .text('🎵 Alta Calidad', 'audio_high')
      .row()
      .text('💾 Peso Ligero', 'audio_low');
    await ctx.reply('🎧 Elige la calidad del audio:', {
      reply_markup: keyboard,
    });
  }
});

bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  const url = userRequests.get(userId);

  if (!url) return ctx.reply('❌ Sesión expirada. Vuelve a enviar el comando.');

  await ctx.answerCallbackQuery('⏳ Iniciando...');
  await ctx.editMessageText(
    '⚙️ Procesando... (Esto puede tardar unos segundos)',
  );

  const downloadFolder = await ensureDownloadFolder();
  const timestamp = Date.now();
  let fileName = '';
  let flags: any = {
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    ffmpegLocation: ffmpegPath,
  };

  try {
    console.log(`📥 Descargando: ${url}`);

    if (data.startsWith('video_')) {
      fileName = `video_${timestamp}.mp4`;
      const filePath = path.join(downloadFolder, fileName);

      flags.output = filePath;
      flags.mergeOutputFormat = 'mp4';

      if (data === 'video_high') flags.format = 'bestvideo+bestaudio/best';
      if (data === 'video_medium')
        flags.format = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
      if (data === 'video_low')
        flags.format = 'bestvideo[height<=480]+bestaudio/best[height<=480]';
    } else if (data.startsWith('audio_')) {
      fileName = `audio_${timestamp}.mp3`;
      const filePath = path.join(downloadFolder, fileName);

      flags.output = path.join(downloadFolder, `audio_${timestamp}.%(ext)s`);
      flags.extractAudio = true;
      flags.audioFormat = 'mp3';
    }

    await youtubeDl(url, flags);

    let finalPath = path.join(downloadFolder, fileName);

    if (!existsSync(finalPath)) {
      console.log(
        '⚠️ El archivo exacto no existe, intentando buscar variantes...',
      );
    }

    console.log(`✅ Descarga completada: ${finalPath}`);
    await ctx.editMessageText('📤 Subiendo a Telegram...');

    const file = new InputFile(finalPath);
    if (data.startsWith('audio_')) {
      await ctx.replyWithAudio(file, {
        title: 'Audio Descargado',
        performer: 'Bot',
      });
    } else {
      await ctx.replyWithVideo(file, { caption: '🎥 Aquí tienes tu video' });
    }

    await unlink(finalPath);

    await ctx.deleteMessage();
  } catch (error) {
    console.error('❌ Error:', error);
    await ctx.editMessageText(
      `❌ Error: No se pudo descargar/enviar el video. \nPosible causa: Video muy largo o restricción de YouTube.`,
    );
  }
});

bot.catch((err) => console.error('Error crítico:', err));

console.log('🤖 Bot iniciado');
bot.start();
