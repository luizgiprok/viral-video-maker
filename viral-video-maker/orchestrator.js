// Viral Video Maker Orchestrator
// Data: 27/02/2026
// Sistema centralizado de gestão de agentes para SaaS de edição de vídeos

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

class ViralVideoMakerOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.config = this.loadConfig();
    this.isRunning = false;
    this.startTime = null;
    this.processingQueue = [];
    this.isProcessing = false;
  }

  loadConfig() {
    const configPath = path.join(__dirname, 'agent-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    return {
      agents: [
        {
          name: 'video-processor',
          file: 'agents/video-processor-agent.js',
          port: 3001,
          description: 'Processamento e edição de vídeos'
        },
        {
          name: 'ai-optimizer',
          file: 'agents/ai-optimizer-agent.js',
          port: 3002,
          description: 'Otimização com IA para viralização'
        },
        {
          name: 'social-media',
          file: 'agents/social-media-agent.js',
          port: 3003,
          description: 'Integração com redes sociais'
        },
        {
          name: 'analytics',
          file: 'agents/analytics-agent.js',
          port: 3004,
          description: 'Análise de performance e métricas'
        },
        {
          name: 'billing',
          file: 'agents/billing-agent.js',
          port: 3005,
          description: 'Gestão financeira e assinaturas'
        },
        {
          name: 'user-management',
          file: 'agents/user-management-agent.js',
          port: 3006,
          description: 'Gerenciamento de usuários e equipes'
        },
        {
          name: 'content-strategy',
          file: 'agents/content-strategy-agent.js',
          port: 3007,
          description: 'Estratégia de conteúdo e tendências'
        },
        {
          name: 'quality-assurance',
          file: 'agents/quality-assurance-agent.js',
          port: 3008,
          description: 'Garantia de qualidade e validação'
        }
      ],
      monitoring: {
        interval: 30000,
        healthCheckTimeout: 5000,
        maxRetries: 3,
        restartDelay: 5000
      },
      queue: {
        maxConcurrentJobs: 5,
        jobTimeout: 300000
      }
    };
  }

  async start() {
    console.log('🚀 Iniciando Viral Video Maker Orchestrator...');
    console.log('================================================');
    
    this.isRunning = true;
    this.startTime = new Date();
    
    try {
      // Iniciar todos os agentes
      await this.startAllAgents();
      
      // Iniciar monitoramento
      this.startMonitoring();
      
      // Iniciar processamento da fila
      this.startQueueProcessing();
      
      // Emite evento de inicialização
      this.emit('started', {
        timestamp: this.startTime,
        agents: Array.from(this.agents.keys()),
        config: this.config
      });
      
      console.log('✅ Orchestrator iniciado com sucesso!');
      console.log(`📊 ${this.agents.size} agentes ativos`);
      console.log('🔄 Monitoramento ativo');
      console.log('🎯 Fila de processamento ativa');
      
    } catch (error) {
      console.error('❌ Erro ao iniciar orchestrator:', error);
      this.isRunning = false;
      throw error;
    }
  }

  async startAllAgents() {
    console.log('🔧 Iniciando agentes...');
    
    for (const agentConfig of this.config.agents) {
      try {
        await this.startAgent(agentConfig);
      } catch (error) {
        console.error(`❌ Falha ao iniciar agente ${agentConfig.name}:`, error.message);
      }
    }
  }

  async startAgent(agentConfig) {
    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      const agentPath = path.join(__dirname, agentConfig.file);
      
      if (!fs.existsSync(agentPath)) {
        reject(new Error(`Arquivo do agente não encontrado: ${agentPath}`));
        return;
      }
      
      console.log(`🚀 Iniciando agente: ${agentConfig.name}`);
      
      const agentProcess = spawn('node', [agentPath], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          AGENT_PORT: agentConfig.port.toString(),
          AGENT_NAME: agentConfig.name
        }
      });
      
      // Armazena informações do processo
      const agentInfo = {
        process: agentProcess,
        config: agentConfig,
        status: 'starting',
        startTime: new Date(),
        lastHealthCheck: null,
        restartCount: 0,
        jobsCompleted: 0,
        jobsFailed: 0
      };
      
      this.agents.set(agentConfig.name, agentInfo);
      
      // Manipula saída do processo
      agentProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`[${agentConfig.name}] ${output}`);
          this.emit('agentOutput', { agent: agentConfig.name, output });
        }
      });
      
      agentProcess.stderr.on('data', (data) => {
        const error = data.toString().trim();
        if (error) {
          console.error(`[${agentConfig.name}] ERROR: ${error}`);
          this.emit('agentError', { agent: agentConfig.name, error });
        }
      });
      
      agentProcess.on('exit', (code, signal) => {
        console.log(`[${agentConfig.name}] Processo encerrado com código ${code}`);
        agentInfo.status = 'stopped';
        this.emit('agentStopped', { agent: agentConfig.name, code, signal });
        
        // Tenta reiniciar automaticamente
        if (this.isRunning && code !== 0) {
          console.log(`🔄 Tentando reiniciar agente ${agentConfig.name}...`);
          agentInfo.restartCount++;
          setTimeout(() => this.startAgent(agentConfig), this.config.monitoring.restartDelay);
        }
      });
      
      agentProcess.on('error', (error) => {
        console.error(`[${agentConfig.name}] Erro no processo: ${error.message}`);
        agentInfo.status = 'error';
        reject(error);
      });
      
      // Marca como iniciado após um tempo
      setTimeout(() => {
        agentInfo.status = 'running';
        console.log(`✅ Agente ${agentConfig.name} iniciado (porta ${agentConfig.port})`);
        resolve();
      }, 3000);
    });
  }

  startMonitoring() {
    console.log('🔄 Iniciando monitoramento...');
    
    setInterval(async () => {
      await this.checkAllAgents();
    }, this.config.monitoring.interval);
    
    // Verificação inicial
    this.checkAllAgents();
  }

  async checkAllAgents() {
    for (const [agentName, agentInfo] of this.agents) {
      try {
        await this.checkAgent(agentName, agentInfo);
      } catch (error) {
        console.error(`❌ Erro ao verificar agente ${agentName}:`, error.message);
      }
    }
  }

  async checkAgent(agentName, agentInfo) {
    if (!this.isRunning) return;
    
    try {
      // Verifica se o processo está rodando
      if (agentInfo.process && agentInfo.process.exitCode !== null) {
        throw new Error('Processo não está rodando');
      }
      
      // Health check via porta
      const { exec } = require('child_process');
      const healthCheck = exec(`curl -s -f http://localhost:${agentInfo.config.port}/health || echo "failed"`);
      
      healthCheck.on('close', (code) => {
        const isHealthy = code === 0;
        const previousStatus = agentInfo.status;
        
        if (isHealthy) {
          agentInfo.status = 'healthy';
          agentInfo.lastHealthCheck = new Date();
          
          if (previousStatus !== 'healthy') {
            console.log(`✅ Agente ${agentName} está saudável`);
            this.emit('agentHealthy', { agent: agentName });
          }
        } else {
          agentInfo.status = 'unhealthy';
          console.log(`⚠️ Agente ${agentName} está com problemas`);
          this.emit('agentUnhealthy', { agent: agentName });
        }
      });
      
    } catch (error) {
      agentInfo.status = 'error';
      console.error(`❌ Agente ${agentName}: ${error.message}`);
      this.emit('agentError', { agent: agentName, error: error.message });
    }
  }

  startQueueProcessing() {
    console.log('🎯 Iniciando processamento da fila...');
    
    setInterval(() => {
      this.processQueue();
    }, 1000);
  }

  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    // Verificar limite de jobs concorrentes
    const runningJobs = Array.from(this.agents.values())
      .filter(agent => agent.status === 'healthy' && agent.activeJobs)
      .reduce((sum, agent) => sum + (agent.activeJobs || 0), 0);

    if (runningJobs >= this.config.queue.maxConcurrentJobs) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0 && runningJobs < this.config.queue.maxConcurrentJobs) {
      const job = this.processingQueue.shift();
      
      try {
        await this.executeJob(job);
      } catch (error) {
        console.error('Erro ao executar job:', error);
        job.status = 'failed';
        job.error = error.message;
        this.emit('jobFailed', { job, error });
      }
    }

    this.isProcessing = false;
  }

  async executeJob(job) {
    console.log(`🎯 Executando job: ${job.id}`);
    
    // Distribuir job para agente adequado
    const agent = this.selectAgentForJob(job);
    if (!agent) {
      throw new Error('Nenhum agente disponível para este job');
    }

    // Adicionar job ao agente
    agent.activeJobs = (agent.activeJobs || 0) + 1;
    
    try {
      // Simular execução do job
      const result = await this.simulateJobExecution(job, agent);
      
      // Atualizar estatísticas
      agent.jobsCompleted++;
      job.status = 'completed';
      job.result = result;
      job.completedAt = new Date();
      
      this.emit('jobCompleted', { job, agent: agent.config.name });
      
    } finally {
      // Remover job do agente
      agent.activeJobs = Math.max(0, (agent.activeJobs || 0) - 1);
    }
  }

  selectAgentForJob(job) {
    const agentMap = {
      'video-upload': 'video-processor',
      'video-process': 'video-processor',
      'ai-optimize': 'ai-optimizer',
      'social-upload': 'social-media',
      'analytics-collect': 'analytics',
      'billing-process': 'billing',
      'user-auth': 'user-management',
      'content-analyze': 'content-strategy',
      'quality-check': 'quality-assurance'
    };

    const agentName = agentMap[job.type];
    return this.agents.get(agentName);
  }

  async simulateJobExecution(job, agent) {
    return new Promise((resolve) => {
      // Simular tempo de processamento
      const processingTime = Math.random() * 5000 + 2000;
      
      setTimeout(() => {
        resolve({
          success: true,
          agent: agent.config.name,
          processedAt: new Date(),
          duration: processingTime,
          result: {
            message: `Job ${job.id} processado com sucesso`,
            data: {
              jobId: job.id,
              type: job.type,
              userId: job.userId
            }
          }
        });
      }, processingTime);
    });
  }

  addJob(job) {
    job.id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    job.status = 'queued';
    job.createdAt = new Date();
    
    this.processingQueue.push(job);
    this.emit('jobQueued', { job });
    
    console.log(`📝 Job ${job.id} adicionado à fila`);
  }

  async stopAgent(agentName) {
    const agentInfo = this.agents.get(agentName);
    if (!agentInfo) {
      throw new Error(`Agente ${agentName} não encontrado`);
    }
    
    console.log(`🛑 Parando agente: ${agentName}`);
    
    if (agentInfo.process) {
      agentInfo.process.kill('SIGTERM');
      
      // Espera graceful shutdown
      await new Promise((resolve) => {
        setTimeout(() => {
          if (agentInfo.process.exitCode === null) {
            agentInfo.process.kill('SIGKILL');
          }
          resolve();
        }, 5000);
      });
    }
    
    this.agents.delete(agentName);
    console.log(`✅ Agente ${agentName} parado`);
  }

  async stopAll() {
    console.log('🛑 Parando todos os agentes...');
    
    const stopPromises = Array.from(this.agents.keys()).map(agentName => 
      this.stopAgent(agentName)
    );
    
    await Promise.all(stopPromises);
    
    this.isRunning = false;
    console.log('✅ Orchestrator parado');
  }

  getStatus() {
    const status = {
      isRunning: this.isRunning,
      startTime: this.startTime,
      uptime: this.startTime ? Date.now() - this.startTime.getTime() : 0,
      agents: {},
      queue: {
        length: this.processingQueue.length,
        isProcessing: this.isProcessing
      }
    };
    
    for (const [agentName, agentInfo] of this.agents) {
      status.agents[agentName] = {
        name: agentName,
        status: agentInfo.status,
        port: agentInfo.config.port,
        startTime: agentInfo.startTime,
        lastHealthCheck: agentInfo.lastHealthCheck,
        restartCount: agentInfo.restartCount,
        jobsCompleted: agentInfo.jobsCompleted,
        jobsFailed: agentInfo.jobsFailed,
        activeJobs: agentInfo.activeJobs || 0,
        description: agentInfo.config.description
      };
    }
    
    return status;
  }

  getAgent(agentName) {
    return this.agents.get(agentName);
  }

  listAgents() {
    return Array.from(this.agents.keys()).map(name => ({
      name,
      ...this.agents.get(name)
    }));
  }

  getQueue() {
    return {
      jobs: this.processingQueue,
      length: this.processingQueue.length,
      isProcessing: this.isProcessing
    };
  }
}

// CLI Interface
if (require.main === module) {
  const orchestrator = new ViralVideoMakerOrchestrator();
  
  // Manipulação de sinais
  process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido SIGINT, parando orchestrator...');
    await orchestrator.stopAll();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Recebido SIGTERM, parando orchestrator...');
    await orchestrator.stopAll();
    process.exit(0);
  });
  
  // Comandos CLI
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      orchestrator.start().catch(console.error);
      break;
      
    case 'stop':
      orchestrator.stopAll().catch(console.error);
      break;
      
    case 'status':
      const status = orchestrator.getStatus();
      console.log(JSON.stringify(status, null, 2));
      break;
      
    case 'list':
      const agents = orchestrator.listAgents();
      console.log(JSON.stringify(agents, null, 2));
      break;
      
    case 'add-job':
      const job = {
        type: process.argv[3] || 'video-upload',
        userId: process.argv[4] || 'user_123',
        data: { message: 'Test job' }
      };
      orchestrator.addJob(job);
      break;
      
    default:
      console.log('Viral Video Maker Orchestrator');
      console.log('==============================');
      console.log('');
      console.log('Comandos:');
      console.log('  node orchestrator.js start    - Inicia todos os agentes');
      console.log('  node orchestrator.js stop     - Para todos os agentes');
      console.log('  node orchestrator.js status   - Mostra status atual');
      console.log('  node orchestrator.js list     - Lista todos os agentes');
      console.log('  node orchestrator.js add-job  - Adiciona job de teste');
      break;
  }
}

module.exports = ViralVideoMakerOrchestrator;