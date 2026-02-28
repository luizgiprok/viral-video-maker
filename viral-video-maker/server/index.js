// Viral Video Maker - SaaS Server
// Data: 27/02/2026
// Main server for automated video creation platform

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

// Importar serviços
const VideoProcessor = require('./services/video-processor');
const AIOptimizer = require('./services/ai-optimizer');
const YouTubeService = require('./services/youtube-service');
const TikTokService = require('./services/tiktok-service');
const AuthService = require('./services/auth-service');
const BillingService = require('./services/billing-service');
const AnalyticsService = require('./services/analytics-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/videos', express.static(path.join(__dirname, '../videos')));

// Rotas principais
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Viral Video Maker SaaS API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Inicializar serviços
const videoProcessor = new VideoProcessor();
const aiOptimizer = new AIOptimizer();
const youtubeService = new YouTubeService();
const tiktokService = new TikTokService();
const authService = new AuthService();
const billingService = new BillingService();
const analyticsService = new AnalyticsService();

// Rotas de Autenticação
app.use('/api/auth', require('./routes/auth'));

// Rotas de Vídeos
app.use('/api/videos', require('./routes/videos'));

// Rotas de Processamento
app.use('/api/process', require('./routes/process'));

// Rotas de Upload
app.post('/api/upload', require('./middleware/upload').single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Nenhum arquivo de vídeo enviado'
    });
  }

  res.json({
    success: true,
    message: 'Vídeo enviado com sucesso',
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// Rotas de Otimização IA
app.post('/api/optimize', async (req, res) => {
  try {
    const { videoPath, platform, options = {} } = req.body;
    
    if (!videoPath || !platform) {
      return res.status(400).json({
        success: false,
        error: 'videoPath e platform são obrigatórios'
      });
    }

    const optimized = await aiOptimizer.optimizeVideo(videoPath, platform, options);
    
    res.json({
      success: true,
      optimized: optimized
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rotas de Upload para Plataformas
app.post('/api/upload/youtube', async (req, res) => {
  try {
    const { videoPath, title, description, tags } = req.body;
    
    const result = await youtubeService.uploadVideo(videoPath, {
      title,
      description,
      tags: tags || []
    });
    
    res.json({
      success: true,
      youtube: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/upload/tiktok', async (req, res) => {
  try {
    const { videoPath, title, description, hashtags } = req.body;
    
    const result = await tiktokService.uploadVideo(videoPath, {
      title,
      description,
      hashtags: hashtags || []
    });
    
    res.json({
      success: true,
      tiktok: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rotas de Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const { userId, period = '7d' } = req.query;
    
    const analytics = await analyticsService.getUserAnalytics(userId, period);
    
    res.json({
      success: true,
      analytics: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rotas de Billing
app.post('/api/billing/subscribe', async (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;
    
    const subscription = await billingService.createSubscription(planId, paymentMethod);
    
    res.json({
      success: true,
      subscription: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rotas de Dashboard
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/viral-video-maker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB conectado');
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Viral Video Maker SaaS rodando na porta ${PORT}`);
    console.log(`🌐 Acesso: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  });
})
.catch(error => {
  console.error('❌ Erro ao conectar ao MongoDB:', error);
  process.exit(1);
});

module.exports = app;