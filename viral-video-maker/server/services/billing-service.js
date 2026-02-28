// Billing Service - Sistema de Pagamentos SaaS
// Data: 27/02/2026
// Integração com Stripe para gerenciamento de assinaturas e cobrança

const Stripe = require('stripe');
const crypto = require('crypto');
const { User, Subscription, Invoice, PaymentMethod } = require('../models');

class BillingService {
  constructor() {
    this.stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    this.plans = {
      basic: {
        id: 'price_basic_monthly',
        name: 'Básico',
        description: 'Perfeito para pequenas empresas',
        price: 9.99,
        currency: 'eur',
        features: [
          '10 vídeos/mês',
          'Edição básica',
          'Suporte por email',
          '720p resolution'
        ],
        limits: {
          videosPerMonth: 10,
          maxVideoDuration: 300,
          maxResolution: '720p'
        }
      },
      professional: {
        id: 'price_professional_monthly',
        name: 'Profissional',
        description: 'Para empresas que precisam de mais',
        price: 29.99,
        currency: 'eur',
        features: [
          '100 vídeos/mês',
          'Edição avançada',
          'Suporte prioritário',
          '1080p resolution',
          'Templates premium',
          'Analytics avançado'
        ],
        limits: {
          videosPerMonth: 100,
          maxVideoDuration: 600,
          maxResolution: '1080p'
        }
      },
      enterprise: {
        id: 'price_enterprise_monthly',
        name: 'Enterprise',
        description: 'Solução completa para grandes empresas',
        price: 99.99,
        currency: 'eur',
        features: [
          'Vídeos ilimitados',
          'Edição profissional',
          'Suporte 24/7',
          '4K resolution',
          'Templates premium',
          'Analytics completo',
          'API access',
          'Integrações customizadas'
        ],
        limits: {
          videosPerMonth: -1, // Ilimitado
          maxVideoDuration: 1800,
          maxResolution: '4k'
        }
      }
    };
  }

  // Retorna planos disponíveis
  async getAvailablePlans() {
    return Object.values(this.plans).map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      features: plan.features,
      limits: plan.limits,
      popular: plan.id === 'price_professional_monthly'
    }));
  }

  // Cria assinatura para usuário
  async subscribeToPlan(userId, planId, paymentMethodId) {
    try {
      // Verificar se usuário existe
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se plano existe
      const plan = Object.values(this.plans).find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plano não encontrado');
      }

      // Adicionar método de pagamento ao Stripe
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId
      });

      // Definir como método de pagamento padrão
      await this.stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Criar assinatura
      const subscription = await this.stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: planId }],
        expand: ['latest_invoice.payment_intent']
      });

      // Salvar assinatura no banco de dados
      const newSubscription = await Subscription.create({
        userId,
        planId,
        planName: plan.name,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      });

      // Atualizar usuário
      await User.findByIdAndUpdate(userId, {
        subscription: newSubscription._id,
        subscriptionStatus: subscription.status,
        subscriptionPlan: plan.name
      });

      return {
        success: true,
        subscription: {
          id: newSubscription._id,
          plan: plan.name,
          status: subscription.status,
          currentPeriodEnd: newSubscription.currentPeriodEnd,
          trialEnd: newSubscription.trialEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        },
        invoice: subscription.latest_invoice
      };

    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw new Error(`Erro ao criar assinatura: ${error.message}`);
    }
  }

  // Cancela assinatura
  async cancelSubscription(userId) {
    try {
      const user = await User.findById(userId).populate('subscription');
      if (!user || !user.subscription) {
        throw new Error('Usuário não tem assinatura ativa');
      }

      const subscription = user.subscription;
      
      // Cancelar no Stripe
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      // Atualizar no banco de dados
      await Subscription.findByIdAndUpdate(subscription._id, {
        cancelAtPeriodEnd: true,
        status: 'cancelling'
      });

      // Atualizar usuário
      await User.findByIdAndUpdate(userId, {
        subscriptionStatus: 'cancelling'
      });

      return {
        success: true,
        message: 'Assinatura cancelada no final do período atual',
        cancelAtPeriodEnd: true,
        currentPeriodEnd: subscription.currentPeriodEnd
      };

    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw new Error(`Erro ao cancelar assinatura: ${error.message}`);
    }
  }

  // Reativa assinatura
  async reactivateSubscription(userId) {
    try {
      const user = await User.findById(userId).populate('subscription');
      if (!user || !user.subscription) {
        throw new Error('Usuário não tem assinatura');
      }

      const subscription = user.subscription;
      
      // Reativar no Stripe
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false
      });

      // Atualizar no banco de dados
      await Subscription.findByIdAndUpdate(subscription._id, {
        cancelAtPeriodEnd: false,
        status: 'active'
      });

      // Atualizar usuário
      await User.findByIdAndUpdate(userId, {
        subscriptionStatus: 'active'
      });

      return {
        success: true,
        message: 'Assinatura reativada com sucesso',
        status: 'active'
      };

    } catch (error) {
      console.error('Erro ao reativar assinatura:', error);
      throw new Error(`Erro ao reativar assinatura: ${error.message}`);
    }
  }

  // Muda plano de assinatura
  async changePlan(userId, newPlanId) {
    try {
      const user = await User.findById(userId).populate('subscription');
      if (!user || !user.subscription) {
        throw new Error('Usuário não tem assinatura ativa');
      }

      const subscription = user.subscription;
      const newPlan = Object.values(this.plans).find(p => p.id === newPlanId);
      if (!newPlan) {
        throw new Error('Novo plano não encontrado');
      }

      // Atualizar plano no Stripe
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [{ price: newPlanId }]
      });

      // Atualizar no banco de dados
      await Subscription.findByIdAndUpdate(subscription._id, {
        planId: newPlanId,
        planName: newPlan.name,
        updatedAt: new Date()
      });

      // Atualizar usuário
      await User.findByIdAndUpdate(userId, {
        subscriptionPlan: newPlan.name
      });

      return {
        success: true,
        message: 'Plano atualizado com sucesso',
        newPlan: newPlan.name
      };

    } catch (error) {
      console.error('Erro ao mudar plano:', error);
      throw new Error(`Erro ao mudar plano: ${error.message}`);
    }
  }

  // Retorna informações de cobrança do usuário
  async getUserBillingInfo(userId) {
    try {
      const user = await User.findById(userId).populate('subscription');
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const subscription = user.subscription;
      const currentPlan = subscription ? 
        Object.values(this.plans).find(p => p.id === subscription.planId) : null;

      return {
        subscription: subscription ? {
          id: subscription._id,
          plan: currentPlan ? currentPlan.name : null,
          status: subscription.status,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          trialEnd: subscription.trialEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
        } : null,
        usage: {
          videosThisMonth: user.videosThisMonth || 0,
          videosLimit: currentPlan ? currentPlan.limits.videosPerMonth : 0
        },
        nextBillingDate: subscription ? 
          new Date(subscription.currentPeriodEnd * 1000) : null
      };

    } catch (error) {
      console.error('Erro ao obter informações de cobrança:', error);
      throw new Error(`Erro ao obter informações de cobrança: ${error.message}`);
    }
  }

  // Retorna faturas do usuário
  async getUserInvoices(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const invoices = await Invoice.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Invoice.countDocuments({ userId });

      return {
        invoices,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total
        }
      };

    } catch (error) {
      console.error('Erro ao obter faturas:', error);
      throw new Error(`Erro ao obter faturas: ${error.message}`);
    }
  }

  // Retorna métodos de pagamento do usuário
  async getUserPaymentMethods(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Buscar métodos de pagamento do Stripe
      const stripeMethods = await this.stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card'
      });

      return {
        paymentMethods: stripeMethods.data.map(method => ({
          id: method.id,
          brand: method.card.brand,
          last4: method.card.last4,
          expMonth: method.card.exp_month,
          expYear: method.card.exp_year,
          isDefault: method.id === user.defaultPaymentMethod
        }))
      };

    } catch (error) {
      console.error('Erro ao obter métodos de pagamento:', error);
      throw new Error(`Erro ao obter métodos de pagamento: ${error.message}`);
    }
  }

  // Adiciona método de pagamento
  async addPaymentMethod(userId, paymentMethodId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Adicionar método de pagamento ao Stripe
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId
      });

      // Atualizar usuário
      await User.findByIdAndUpdate(userId, {
        defaultPaymentMethod: paymentMethodId
      });

      return {
        success: true,
        paymentMethod: {
          id: paymentMethod.id,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year
        }
      };

    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error);
      throw new Error(`Erro ao adicionar método de pagamento: ${error.message}`);
    }
  }

  // Remove método de pagamento
  async removePaymentMethod(userId, paymentMethodId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se é o método padrão
      if (user.defaultPaymentMethod === paymentMethodId) {
        throw new Error('Não é possível remover o método de pagamento padrão');
      }

      // Remover do Stripe
      await this.stripe.paymentMethods.detach(paymentMethodId);

      return {
        success: true,
        message: 'Método de pagamento removido com sucesso'
      };

    } catch (error) {
      console.error('Erro ao remover método de pagamento:', error);
      throw new Error(`Erro ao remover método de pagamento: ${error.message}`);
    }
  }

  // Cria cliente Stripe para novo usuário
  async createStripeCustomer(user) {
    try {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.companyName || user.name,
        metadata: {
          userId: user._id.toString()
        }
      });

      return customer.id;

    } catch (error) {
      console.error('Erro ao criar cliente Stripe:', error);
      throw new Error(`Erro ao criar cliente Stripe: ${error.message}`);
    }
  }

  // Processa webhook do Stripe
  async handleStripeWebhook(event) {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          console.log(`Evento não tratado: ${event.type}`);
      }

    } catch (error) {
      console.error('Erro ao processar webhook do Stripe:', error);
      throw error;
    }
  }

  // Trata pagamento de fatura bem sucedido
  async handleInvoicePaymentSucceeded(invoice) {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription
    });

    if (subscription) {
      subscription.status = 'active';
      subscription.lastPaymentDate = new Date();
      await subscription.save();
    }
  }

  // Trata falha no pagamento
  async handleInvoicePaymentFailed(invoice) {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription
    });

    if (subscription) {
      subscription.status = 'past_due';
      await subscription.save();
    }
  }

  // Trata atualização de assinatura
  async handleSubscriptionUpdated(subscription) {
    const dbSubscription = await Subscription.findOne({
      stripeSubscriptionId: subscription.id
    });

    if (dbSubscription) {
      dbSubscription.status = subscription.status;
      dbSubscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
      dbSubscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      dbSubscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
      await dbSubscription.save();
    }
  }

  // Trata exclusão de assinatura
  async handleSubscriptionDeleted(subscription) {
    const dbSubscription = await Subscription.findOne({
      stripeSubscriptionId: subscription.id
    });

    if (dbSubscription) {
      await Subscription.findByIdAndDelete(dbSubscription._id);
    }
  }
}

module.exports = BillingService;