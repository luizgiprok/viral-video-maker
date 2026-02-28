name: Viral Video Maker

# Arquivo README.md para o projeto Viral Video Maker SaaS

## 🎥 Viral Video Maker SaaS

Uma plataforma SaaS completa para criação automática de vídeos virais otimizados para YouTube e TikTok.

### 🚀 Funcionalidades

- **✅ Upload de vídeos** - Drag & drop interface
- **✅ Edição automática** - IA para cortes e melhorias
- **✅ Otimização para plataformas** - YouTube, TikTok, Instagram
- **✅ Upload automático** - Publicação direta nas redes
- **✅ Analytics em tempo real** - Performance e engajamento
- **✅ Sistema de pagamentos** - Assinaturas e créditos
- **✅ Dashboard completo** - Painel de controle intuitivo
- **✅ Multi-usuário** - Equipes e permissões

### 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   API Server    │    │   Orchestrator  │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Agents)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   Cloud Storage │
                                               │   (AWS S3)      │
                                               └─────────────────┘
```

### 🤒 Agentes Especializados

- **Video Processor Agent** - Processamento e edição
- **AI Optimizer Agent** - Inteligência artificial
- **Social Media Agent** - Integração com redes
- **Analytics Agent** - Análise de performance
- **Billing Agent** - Gestão financeira
- **User Management Agent** - Gerenciamento de usuários
- **Content Strategy Agent** - Estratégia de conteúdo
- **Quality Assurance Agent** - Garantia de qualidade

### 🛠️ Tecnologias

**Backend:**
- Node.js 18+
- Express.js
- MongoDB
- Stripe (pagamentos)
- FFmpeg (processamento de vídeo)
- OpenAI (IA)

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Query

**Infraestrutura:**
- Netlify (frontend)
- Vercel/Render (backend)
- AWS S3 (armazenamento)
- Redis (cache)

### 🚀 Como Começar

#### Pré-requisitos
- Node.js 18+
- MongoDB
- Stripe Account
- OpenAI API Key

#### Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/viral-video-maker.git
cd viral-video-maker
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Inicie o servidor
```bash
npm run dev
```

### 📊 Configuração

#### Variáveis de Ambiente

```env
# Database
MONGODB_URI=mongodb://localhost:27017/viral-video-maker

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-...

# JWT
JWT_SECRET=sua-chave-secreta

# Email (opcional)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=sua-chave-de-email

# Netlify
NETLIFY_AUTH_TOKEN=seu-token-netlify
```

#### Stripe Configuration

1. Crie uma conta no [Stripe Dashboard](https://dashboard.stripe.com)
2. Configure produtos e preços
3. Adicione webhooks para:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`

### 🔧 Desenvolvimento

#### Scripts Disponíveis

```bash
npm run dev          # Iniciar modo desenvolvimento
npm run build        # Construir aplicação
npm run start        # Iniciar produção
npm test             # Rodar testes
npm lint             # Chear código
npm format           # Formatar código
```

#### Estrutura de Pastas

```
viral-video-maker/
├── server/           # Backend API
├── client/           # Frontend React
├── agents/           # Agentes especializados
├── services/         # Serviços compartilhados
├── utils/            # Utilitários
├── uploads/          # Arquivos de upload
├── videos/           # Vídeos processados
├── .github/          # GitHub Actions
├── docs/             # Documentação
└── tests/            # Testes
```

### 🚀 Deploy

#### Netlify (Frontend)

1. Conecte seu repositório ao Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `client/build`
   - Environment variables: configure as necessárias

#### Vercel/Render (Backend)

1. Conecte seu repositório ao Vercel/Render
2. Configure variáveis de ambiente
3. Configure build e deploy settings

### 📈 Monitoramento

- **Health Checks**: `/health` endpoint
- **Logging**: Winston logs em ambiente de produção
- **Analytics**: Mixpanel ou PostHog
- **Error Tracking**: Sentry

### 🔒 Segurança

- Autenticação JWT
- Rate limiting
- Input validation
- CORS protection
- Helmet.js security
- Regular security audits

### 📦 API

#### Endpoints Principais

```bash
# Autenticação
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password

# Vídeos
POST /api/videos/upload
POST /api/videos/process
GET /api/videos/:id
DELETE /api/videos/:id

# Dashboard
GET /api/dashboard/stats
GET /api/dashboard/videos
POST /api/dashboard/videos/upload

# Pagamentos
POST /api/billing/subscribe
GET /api/billing/invoices
POST /api/billing/cancel
```

### 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 🙏 Agradecimentos

- OpenAI pelo suporte de IA
- Stripe pela excelente plataforma de pagamentos
- Netlify pelo ótimo serviço de deploy
- Comunity Node.js e React

---

**Desenvolvido com ❤️ por Leandro e equipe** 🚀