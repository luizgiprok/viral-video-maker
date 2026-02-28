// Video Processor Service - Processamento de Vídeos
// Data: 27/02/2026
// Serviço principal para edição e otimização de vídeos

const ffmpeg = require('@ffmpeg/ffmpeg');
const { FFmpeg } = require('@ffmpeg/ffmpeg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class VideoProcessor {
  constructor() {
    this.ffmpeg = null;
    this.tempDir = path.join(__dirname, '../../temp');
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.videosDir = path.join(__dirname, '../../videos');
    
    // Criar diretórios necessários
    this.ensureDirectories();
    
    // Inicializar FFmpeg
    this.initializeFFmpeg();
  }

  // Garante que diretórios existam
  ensureDirectories() {
    const dirs = [this.tempDir, this.uploadsDir, this.videosDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Inicializa FFmpeg
  async initializeFFmpeg() {
    try {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load();
      this.ffmpeg = ffmpeg;
      console.log('✅ FFmpeg inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar FFmpeg:', error);
      throw new Error('FFmpeg não está disponível');
    }
  }

  // Processa vídeo para otimização
  async processVideo(inputPath, options = {}) {
    try {
      const {
        outputFormat = 'mp4',
        resolution = '1080p',
        bitrate = '8000k',
        fps = 30,
        addWatermark = false,
        watermarkPath = null,
        trimStart = 0,
        trimEnd = null,
        speed = 1.0,
        volume = 1.0
      } = options;

      // Gerar nome de arquivo de saída
      const outputId = crypto.randomBytes(8).toString('hex');
      const outputPath = path.join(this.videosDir, `processed_${outputId}.${outputFormat}`);

      // Construir comando FFmpeg
      const command = this.buildFFmpegCommand(inputPath, outputPath, {
        resolution,
        bitrate,
        fps,
        addWatermark,
        watermarkPath,
        trimStart,
        trimEnd,
        speed,
        volume
      });

      // Executar processamento
      const result = await this.executeFFmpegCommand(command);

      return {
        success: true,
        inputPath,
        outputPath,
        outputId,
        duration: result.duration,
        size: result.size,
        format: outputFormat,
        options: options
      };

    } catch (error) {
      throw new Error(`Erro ao processar vídeo: ${error.message}`);
    }
  }

  // Constrói comando FFmpeg
  buildFFmpegCommand(inputPath, outputPath, options) {
    const {
      resolution,
      bitrate,
      fps,
      addWatermark,
      watermarkPath,
      trimStart,
      trimEnd,
      speed,
      volume
    } = options;

    let command = [];

    // Input
    command.push(`-i "${inputPath}"`);

    // Trim (cortes)
    if (trimStart > 0 || trimEnd) {
      let trimFilter = `trim=start=${trimStart}`;
      if (trimEnd) {
        trimFilter += `:end=${trimEnd}`;
      }
      command.push(`-vf "${trimFilter}"`);
    }

    // Resolução
    if (resolution) {
      const [width, height] = this.parseResolution(resolution);
      command.push(`-vf "scale=${width}:-1"`);
    }

    // Bitrate
    if (bitrate) {
      command.push(`-b:v ${bitrate}`);
    }

    // FPS
    if (fps) {
      command.push(`-r ${fps}`);
    }

    // Velocidade (slow motion ou time-lapse)
    if (speed !== 1.0) {
      command.push(`-vf "setpts=${speed}*PTS"`);
    }

    // Volume
    if (volume !== 1.0) {
      command.push(`-af "volume=${volume}"`);
    }

    // Watermark
    if (addWatermark && watermarkPath) {
      command.push(`-vf "movie='${watermarkPath}' [watermark]; [in][watermark] overlay=10:10 [out]"`);
    }

    // Formato e saída
    command.push(`-c:v libx264`);
    command.push(`-c:a aac`);
    command.push(`-preset fast`);
    command.push(`-crf 23`);
    command.push(`-y`); // Sobrescreve arquivo existente
    command.push(`"${outputPath}"`);

    return command.join(' ');
  }

  // Executa comando FFmpeg
  async executeFFmpegCommand(command) {
    return new Promise((resolve, reject) => {
      const exec = require('child_process').exec;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        // Extrair informações do output
        const duration = this.extractDuration(stderr);
        const size = this.extractFileSize(command);

        resolve({ duration, size });
      });
    });
  }

  // Converte string de resolução para dimensões
  parseResolution(resolution) {
    const resolutions = {
      '480p': [854, 480],
      '720p': [1280, 720],
      '1080p': [1920, 1080],
      '2k': [2560, 1440],
      '4k': [3840, 2160]
    };

    return resolutions[resolution] || [1920, 1080];
  }

  // Extrai duração do output do FFmpeg
  extractDuration(stderr) {
    const durationMatch = stderr.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/);
    if (durationMatch) {
      const [hours, minutes, seconds] = durationMatch[1].split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  }

  // Extrai tamanho do arquivo processado
  extractFileSize(command) {
    const outputPath = command.match(/"([^"]+\.mp4)"$/)?.[1];
    if (outputPath && fs.existsSync(outputPath)) {
      return fs.statSync(outputPath).size;
    }
    return 0;
  }

  // Cria vídeo otimizado para TikTok
  async createTikTokVideo(inputPath, options = {}) {
    const tiktokOptions = {
      ...options,
      resolution: '1080p',
      bitrate: '6000k',
      fps: 30,
      trimStart: 0,
      trimEnd: 60, // Máximo 60 segundos para TikTok
      speed: 1.0,
      volume: 1.0
    };

    return await this.processVideo(inputPath, tiktokOptions);
  }

  // Cria vídeo otimizado para YouTube
  async createYouTubeVideo(inputPath, options = {}) {
    const youtubeOptions = {
      ...options,
      resolution: '1080p',
      bitrate: '8000k',
      fps: 30,
      trimStart: 0,
      trimEnd: null,
      speed: 1.0,
      volume: 1.0
    };

    return await this.processVideo(inputPath, youtubeOptions);
  }

  // Adiciona texto ao vídeo
  async addTextToVideo(inputPath, text, options = {}) {
    const {
      fontSize = 24,
      fontColor = 'white',
      backgroundColor = 'black',
      position = 'center',
      duration = 5
    } = options;

    const outputId = crypto.randomBytes(8).toString('hex');
    const outputPath = path.join(this.videosDir, `text_${outputId}.mp4`);

    const command = [
      `-i "${inputPath}"`,
      `-vf "drawtext=text='${text}':fontsize=${fontSize}:fontcolor=${fontColor}:box=1:boxcolor=${backgroundColor}@0.5:x=(w-tw)/2:y=(h-th)/2:enable='between(t,0,${duration})'"`,
      `-c:v libx264`,
      `-c:a aac`,
      `-y`,
      `"${outputPath}"`
    ].join(' ');

    await this.executeFFmpegCommand(command);

    return {
      success: true,
      outputPath,
      outputId,
      text,
      options
    };
  }

  // Remove áudio do vídeo
  async removeAudio(inputPath) {
    const outputId = crypto.randomBytes(8).toString('hex');
    const outputPath = path.join(this.videosDir, `mute_${outputId}.mp4`);

    const command = [
      `-i "${inputPath}"`,
      `-c:v copy`,
      `-an`,
      `-y`,
      `"${outputPath}"`
    ].join(' ');

    await this.executeFFmpegCommand(command);

    return {
      success: true,
      outputPath,
      outputId,
      muted: true
    };
  }

  // Pega informações do vídeo
  async getVideoInfo(inputPath) {
    return new Promise((resolve, reject) => {
      const exec = require('child_process').exec;
      
      const command = `ffprobe -v quiet -print_format json -show_format -show_streams "${inputPath}"`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          const info = JSON.parse(stdout);
          resolve(info);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  // Limpa arquivos temporários
  cleanup() {
    try {
      const files = fs.readdirSync(this.tempDir);
      files.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error('Erro ao limpar arquivos temporários:', error);
    }
  }

  // Health check
  healthCheck() {
    return {
      success: true,
      service: 'video-processor',
      status: 'healthy',
      ffmpeg: this.ffmpeg ? 'available' : 'unavailable',
      tempDir: this.tempDir,
      uploadsDir: this.uploadsDir,
      videosDir: this.videosDir
    };
  }
}

module.exports = VideoProcessor;