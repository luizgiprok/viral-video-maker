// Dashboard Routes - Rotas do Dashboard SaaS
// Data: 27/02/2026
// Rotas principais do dashboard para gerenciamento do SaaS

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsService = require('../services/analytics-service');
const BillingService = require('../services/billing-service');
const VideoService = require('../services/video-service');
const UserService = require('../services/user-service');

// Dashboard Principal
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar dados do dashboard
    const [stats, recentVideos, billingInfo, teamMembers] = await Promise.all([
      AnalyticsService.getDashboardStats(userId),
      VideoService.getRecentVideos(userId, 5),
      BillingService.getUserBillingInfo(userId),
      UserService.getTeamMembers(userId)
    ]);

    res.json({
      success: true,
      dashboard: {
        stats,
        recentVideos,
        billingInfo,
        teamMembers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Estatísticas do Dashboard
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const userId = req.user.id;
    
    const stats = await AnalyticsService.getDashboardStats(userId, period);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Gráficos de Performance
router.get('/dashboard/charts', auth, async (req, res) => {
  try {
    const { type = 'videos', period = '30d' } = req.query;
    const userId = req.user.id;
    
    const charts = await AnalyticsService.getPerformanceCharts(userId, type, period);
    
    res.json({
      success: true,
      charts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Vídeos Recentes
router.get('/dashboard/videos', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const userId = req.user.id;
    
    const videos = await VideoService.getUserVideos(userId, page, limit, status);
    
    res.json({
      success: true,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Detalhes do Vídeo
router.get('/dashboard/videos/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const video = await VideoService.getVideoDetails(id, userId);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Vídeo não encontrado'
      });
    }
    
    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Upload de Vídeo
router.post('/dashboard/videos/upload', auth, require('../middleware/upload').single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo de vídeo enviado'
      });
    }

    const userId = req.user.id;
    const { title, description, platforms = [] } = req.body;
    
    const video = await VideoService.uploadVideo(userId, {
      file: req.file,
      title,
      description,
      platforms
    });
    
    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Processar Vídeo
router.post('/dashboard/videos/:id/process', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { platforms = ['youtube', 'tiktok'], options = {} } = req.body;
    
    const result = await VideoService.processVideo(id, userId, {
      platforms,
      options
    });
    
    res.json({
      success: true,
      processing: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Status do Processamento
router.get('/dashboard/videos/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const status = await VideoService.getProcessingStatus(id, userId);
    
    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Gerenciar Planos
router.get('/dashboard/billing/plans', auth, async (req, res) => {
  try {
    const plans = await BillingService.getAvailablePlans();
    
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Assinar Plano
router.post('/dashboard/billing/subscribe', auth, async (req, res) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const userId = req.user.id;
    
    const subscription = await BillingService.subscribeToPlan(userId, planId, paymentMethodId);
    
    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cancelar Assinatura
router.post('/dashboard/billing/cancel', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await BillingService.cancelSubscription(userId);
    
    res.json({
      success: true,
      cancellation: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Histórico de Faturas
router.get('/dashboard/billing/invoices', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    
    const invoices = await BillingService.getUserInvoices(userId, page, limit);
    
    res.json({
      success: true,
      invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Métodos de Pagamento
router.get('/dashboard/billing/payment-methods', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const paymentMethods = await BillingService.getUserPaymentMethods(userId);
    
    res.json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Adicionar Método de Pagamento
router.post('/dashboard/billing/payment-methods', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = req.user.id;
    
    const paymentMethod = await BillingService.addPaymentMethod(userId, paymentMethodId);
    
    res.json({
      success: true,
      paymentMethod
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Equipe
router.get('/dashboard/team', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const team = await UserService.getTeamMembers(userId);
    
    res.json({
      success: true,
      team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Convidar Membro da Equipe
router.post('/dashboard/team/invite', auth, async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const userId = req.user.id;
    
    const invitation = await UserService.inviteTeamMember(userId, email, role);
    
    res.json({
      success: true,
      invitation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remover Membro da Equipe
router.delete('/dashboard/team/:memberId', auth, async (req, res) => {
  try {
    const { memberId } = req.params;
    const userId = req.user.id;
    
    const result = await UserService.removeTeamMember(userId, memberId);
    
    res.json({
      success: true,
      removal: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Configurações da Conta
router.get('/dashboard/settings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const settings = await UserService.getUserSettings(userId);
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Atualizar Configurações
router.put('/dashboard/settings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { settings } = req.body;
    
    const updated = await UserService.updateUserSettings(userId, settings);
    
    res.json({
      success: true,
      settings: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Exportar Relatórios
router.get('/dashboard/reports/export', auth, async (req, res) => {
  try {
    const { type = 'videos', format = 'csv', period = '30d' } = req.query;
    const userId = req.user.id;
    
    const report = await AnalyticsService.exportReport(userId, type, format, period);
    
    res.setHeader('Content-Type', report.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    res.send(report.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;