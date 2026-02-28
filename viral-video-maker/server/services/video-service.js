// Video Service - Gerenciamento de Vídeos
// Data: 27/02/2026
// Serviço para upload, processamento e gerenciamento de vídeos

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Video, ProcessingJob } = require('../models');
const VideoProcessor = require('./video-processor');
const AIOptimizer = require('./ai-optimizer');

class VideoService {
  constructor() {
    this.videoProcessor = new VideoProcessor();
    this.aiOptimizer = new AIOptimizer();
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.videosDir = path.join(__dirname, '../../videos');
    this.processingQueue = [];
    this.isProcessing = false;
    
    // Garantir diretórios existem
    this.ensureDirectories();
  }

  // Garante que diretórios existam
  ensureDirectories() {
    const dirs = [this.uploadsDir, this.videosDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Faz upload de vídeo
  async uploadVideo(userId, fileData) {
    try {
      const { file, title, description, platforms = [] } = fileData;
      
      if (!file) {
        throw new Error('Nenhum arquivo de vídeo enviado');
      }

      // Validar arquivo
      await this.validateVideoFile(file);

      // Criar registro do vídeo
      const video = new Video({
        userId,
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        title: title || file.originalname,
        description: description || '',
        platforms,
        status: 'uploaded',
        uploadedAt: new Date()
      });

      await video.save();

      // Extrair metadados do vídeo
      const metadata = await this.videoProcessor.getVideoInfo(file.path);
      video.metadata = {
        duration: metadata.format.duration,
        bitrate: metadata.format.bit_rate,
        resolution: this.extractResolution(metadata.streams),
        format: metadata.format.format_name
      };

      await video.save();

      return {
        success: true,
        video: {
          id: video._id,
          title: video.title,
          status: video.status,
          size: video.size,
          duration: video.metadata.duration,
          platforms: video.platforms
        }
      };

    } catch (error) {
      console.error('Erro ao fazer upload do vídeo:', error);
      throw new Error(`Erro ao fazer upload do vídeo: ${error.message}`);
    }
  }

  // Valida arquivo de vídeo
  async validateVideoFile(file) {
    const allowedMimeTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
      'video/webm'
    ];

    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Formato de vídeo não suportado');
    }

    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo: 500MB');
    }
  }

  // Extrai resolução do vídeo
  extractResolution(streams) {
    const videoStream = streams.find(stream => stream.codec_type === 'video');
    if (videoStream) {
      const width = videoStream.width;
      const height = videoStream.height;
      
      if (width >= 3840 && height >= 2160) return '4k';
      if (width >= 2560 && height >= 1440) return '2k';
      if (width >= 1920 && height >= 1080) return '1080p';
      if (width >= 1280 && height >= 720) return '720p';
      if (width >= 854 && height >= 480) return '480p';
      
      return `${width}x${height}`;
    }
    
    return 'unknown';
  }

  // Processa vídeo
  async processVideo(videoId, userId, options = {}) {
    try {
      const video = await Video.findOne({ _id: videoId, userId });
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      if (video.status !== 'uploaded') {
        throw new Error('Vídeo não está pronto para processamento');
      }

      // Verificar limite do plano
      await this.checkPlanLimits(userId);

      // Criar job de processamento
      const job = new ProcessingJob({
        videoId,
        userId,
        platforms: options.platforms || ['youtube', 'tiktok'],
        options: options.options || {},
        status: 'queued',
        queuedAt: new Date()
      });

      await job.save();

      // Adicionar à fila de processamento
      this.processingQueue.push(job);
      
      // Iniciar processamento se não estiver rodando
      if (!this.isProcessing) {
        this.processQueue();
      }

      return {
        success: true,
        job: {
          id: job._id,
          videoId: job.videoId,
          platforms: job.platforms,
          status: job.status,
          queuedAt: job.queuedAt
        },
        message: 'Vídeo adicionado à fila de processamento'
      };

    } catch (error) {
      console.error('Erro ao processar vídeo:', error);
      throw new Error(`Erro ao processar vídeo: ${error.message}`);
    }
  }

  // Verifica limites do plano
  async checkPlanLimits(userId) {
    // TODO: Implementar verificação de limites do plano
    // Por enquanto, permitir processamento
    return true;
  }

  // Processa fila de vídeos
  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const job = this.processingQueue.shift();
      
      try {
        await this.processJob(job);
      } catch (error) {
        console.error('Erro ao processar job:', error);
        await this.updateJobStatus(job._id, 'failed', error.message);
      }
    }

    this.isProcessing = false;
  }

  // Processa um job individual
  async processJob(job) {
    try {
      // Atualizar status para processando
      await this.updateJobStatus(job._id, 'processing');

      const video = await Video.findById(job.videoId);
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      const results = {};

      // Processar para cada plataforma
      for (const platform of job.platforms) {
        try {
          let processedVideo;

          switch (platform) {
            case 'youtube':
              processedVideo = await this.videoProcessor.createYouTubeVideo(
                video.path,
                job.options
              );
              break;
            case 'tiktok':
              processedVideo = await this.videoProcessor.createTikTokVideo(
                video.path,
                job.options
              );
              break;
            default:
              throw new Error(`Plataforma não suportada: ${platform}`);
          }

          // Otimizar com IA
          const optimized = await this.aiOptimizer.optimizeVideo(
            processedVideo.outputPath,
            platform,
            job.options
          );

          results[platform] = {
            ...processedVideo,
            optimized
          };

          // Atualizar vídeo com informações da plataforma
          video[`${platform}Processed`] = true;
          video[`${platform}Url`] = processedVideo.outputPath;
          video[`${platform}ProcessedAt`] = new Date();

        } catch (platformError) {
          console.error(`Erro ao processar para ${platform}:`, platformError);
          results[platform] = { error: platformError.message };
        }
      }

      // Atualizar status do job
      await this.updateJobStatus(job._id, 'completed', null, results);

      // Atualizar status do vídeo
      video.status = 'processed';
      video.processedAt = new Date();
      await video.save();

      // Upload automático para plataformas (se configurado)
      await this.uploadToPlatforms(video, results);

    } catch (error) {
      await this.updateJobStatus(job._id, 'failed', error.message);
      throw error;
    }
  }

  // Atualiza status do job
  async updateJobStatus(jobId, status, error = null, results = null) {
    await ProcessingJob.findByIdAndUpdate(jobId, {
      status,
      error,
      results,
      updatedAt: new Date()
    });
  }

  // Faz upload para plataformas
  async uploadToPlatforms(video, results) {
    // TODO: Implementar upload automático para YouTube e TikTok
    // Por enquanto, apenas registrar os resultados
    console.log('Resultados do processamento:', results);
  }

  // Busca vídeos do usuário
  async getUserVideos(userId, page = 1, limit = 10, status = 'all') {
    try {
      const skip = (page - 1) * limit;
      
      // Construir query
      const query = { userId };
      if (status !== 'all') {
        query.status = status;
      }

      const videos = await Video.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('processingJobs', 'status platforms createdAt');

      const total = await Video.countDocuments(query);

      return {
        videos,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total
        }
      };

    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      throw new Error(`Erro ao buscar vídeos: ${error.message}`);
    }
  }

  // Busca detalhes do vídeo
  async getVideoDetails(videoId, userId) {
    try {
      const video = await Video.findOne({ _id: videoId, userId })
        .populate('processingJobs');

      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      return video;

    } catch (error) {
      console.error('Erro ao buscar detalhes do vídeo:', error);
      throw new Error(`Erro ao buscar detalhes do vídeo: ${error.message}`);
    }
  }

  // Busca status do processamento
  async getProcessingStatus(videoId, userId) {
    try {
      const video = await Video.findOne({ _id: videoId, userId });
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      const latestJob = await ProcessingJob.findOne({ videoId })
        .sort({ createdAt: -1 });

      return {
        videoId,
        status: video.status,
        processingJob: latestJob
      };

    } catch (error) {
      console.error('Erro ao buscar status de processamento:', error);
      throw new Error(`Erro ao buscar status de processamento: ${error.message}`);
    }
  }

  // Deleta vídeo
  async deleteVideo(videoId, userId) {
    try {
      const video = await Video.findOne({ _id: videoId, userId });
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      // Deletar arquivos
      if (fs.existsSync(video.path)) {
        fs.unlinkSync(video.path);
      }

      // Deletar arquivos processados
      ['youtube', 'tiktok'].forEach(platform => {
        const processedPath = video[`${platform}Url`];
        if (processedPath && fs.existsSync(processedPath)) {
          fs.unlinkSync(processedPath);
        }
      });

      // Deletar registro do banco
      await Video.findByIdAndDelete(videoId);

      return {
        success: true,
        message: 'Vídeo deletado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
      throw new Error(`Erro ao deletar vídeo: ${error.message}`);
    }
  }

  // Busca vídeos recentes
  async getRecentVideos(userId, limit = 5) {
    try {
      const videos = await Video.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title status size createdAt platforms');

      return videos;

    } catch (error) {
      console.error('Erro ao buscar vídeos recentes:', error);
      throw new Error(`Erro ao buscar vídeos recentes: ${error.message}`);
    }
  }

  // Atualiza metadados do vídeo
  async updateVideoMetadata(videoId, userId, metadata) {
    try {
      const video = await Video.findOne({ _id: videoId, userId });
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      video.title = metadata.title || video.title;
      video.description = metadata.description || video.description;
      video.platforms = metadata.platforms || video.platforms;
      video.tags = metadata.tags || video.tags;
      video.updatedAt = new Date();

      await video.save();

      return {
        success: true,
        video
      };

    } catch (error) {
      console.error('Erro ao atualizar metadados:', error);
      throw new Error(`Erro ao atualizar metadados: ${error.message}`);
    }
  }

  // Adiciona texto ao vídeo
  async addTextToVideo(videoId, userId, text, options = {}) {
    try {
      const video = await Video.findOne({ _id: videoId, userId });
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      const result = await this.videoProcessor.addTextToVideo(
        video.path,
        text,
        options
      );

      return result;

    } catch (error) {
      console.error('Erro ao adicionar texto ao vídeo:', error);
      throw new Error(`Erro ao adicionar texto ao vídeo: ${error.message}`);
    }
  }

  // Remove áudio do vídeo
  async removeAudio(videoId, userId) {
    try {
      const video = await Video.findOne({ _id: videoId, userId });
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      const result = await this.videoProcessor.removeAudio(video.path);

      return result;

    } catch (error) {
      console.error('Erro ao remover áudio do vídeo:', error);
      throw new Error(`Erro ao remover áudio do vídeo: ${error.message}`);
    }
  }

  // Health check
  healthCheck() {
    return {
      success: true,
      service: 'video-service',
      status: 'healthy',
      queue: {
        length: this.processingQueue.length,
        isProcessing: this.isProcessing
      },
      directories: {
        uploads: this.uploadsDir,
        videos: this.videosDir
      }
    };
  }
}

module.exports = VideoService;