🛍️ Bewear E-commerce – Plataforma de Venda de Roupa (📱 Responsivo)
📌 Objetivo do Projeto

Este projeto apresenta uma plataforma de comércio eletrónico totalmente funcional, permitindo que os utilizadores naveguem por produtos de vestuário, geram os seus carrinhos de compras e finalizem pedidos de forma segura. A experiência foi desenhada para ser intuitiva, responsiva e esteticamente apelativa.

✨ Funcionalidades Principais
🛍️ Catálogo de Produtos: Navegação simples por categorias e itens.
🛒 Carrinho de Compras: Gestão completa dos produtos selecionados.
💳 Checkout Seguro com Stripe: Processamento de pagamentos confiável.
🔐 Autenticação de Utilizadores: Registo e login seguro, incluindo login social.
📦 Gestão de Pedidos: Histórico completo e acompanhamento do estado das encomendas.
📱 Design Responsivo: Experiência otimizada para todos os dispositivos.
🔎 Recomendações Personalizadas: Sugestões de produtos complementares.
📧 Notificação por E-mail: Envio automático de detalhes da encomenda ao vendedor.


🛠️ Tecnologias Utilizadas

Frontend
⚛️ Next.js 15 + React 19
🔷 TypeScript
🎨 Tailwind CSS
🧩 Radix UI + shadcn/ui
Backend
🔄 Next.js API Routes
🗃️ Drizzle ORM
🐘 PostgreSQL
🔐 Better Auth
💰 Stripe Payments
🔄 TanStack Query

🚀 Instalação e Configuração
Requisitos
Node.js 18+
PostgreSQL
Conta Stripe (para processamento de pagamentos)

Passos de Configuração

Clonar o repositório:

git clone https://github.com/seu-usuario/bewear-ecommerce.git
cd bewear-ecommerce


Criar um ficheiro .env.local na raiz do projeto com as seguintes variáveis:

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Base de Dados
DATABASE_URL=postgresql://...

# Autenticação
AUTH_SECRET=...

Instalar dependências:
npm install

Configurar e popular a base de dados:
npm run db:generate
npm run db:push
npm run db:seed


Iniciar servidor de desenvolvimento:
npm run dev

Abrir no navegador: http://localhost:3000
