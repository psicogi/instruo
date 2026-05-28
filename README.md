# instruo 🚗🏍️

> Sistema de agendamento de aulas práticas para instrutores autônomos de autoescola.

---

## O problema que resolvemos

Instrutores autônomos de autoescola gerenciam tudo no WhatsApp — agendamentos, pagamentos, cancelamentos, confirmações. O resultado é uma bagunça de mensagens, horários perdidos, pagamentos que "ficam para depois" e alunos que somem sem avisar.

Não existia uma ferramenta simples, barata e focada nesse público. O **Instruo** nasceu para resolver exatamente isso.

---

## A solução

Uma plataforma web onde o aluno acessa o perfil do instrutor, escolhe o tipo de aula, compra um pacote, agenda o horário e paga via PIX — tudo em menos de 3 minutos. O pagamento vai direto para o instrutor. O horário fica bloqueado no calendário. E o instrutor acessa o painel com a agenda do dia pronta.

---

## Funcionalidades

### Para o aluno
- Visualiza perfil completo do instrutor (categorias CNH, veículos, área de atuação, avaliações)
- Escolhe entre aula de carro (Cat. B) ou moto (Cat. A)
- Seleciona pacotes com desconto progressivo (avulsa, 6 ou 12 aulas)
- Agenda a 1ª aula em calendário com horários reais
- Informa endereço de embarque — o instrutor busca na porta
- Paga via PIX com QR code gerado em tempo real pelo Mercado Pago
- Acessa "Minhas aulas" pelo WhatsApp cadastrado para agendar as demais aulas do pacote

### Para o instrutor
- Painel protegido por login (e-mail e senha)
- Agenda do dia com nome, endereço e tipo de aula de cada aluno
- Faturamento da semana e quantidade de aulas no mês
- Calendário atualizado automaticamente com horários ocupados

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend + Backend | Next.js 15 (App Router) |
| Banco de dados | PostgreSQL via Supabase |
| ORM | Prisma 6 |
| Autenticação | NextAuth.js v4 (credentials) |
| Pagamentos | Mercado Pago (Checkout Transparente + PIX) |
| Estilização | Tailwind CSS v4 + CSS Variables |
| Deploy | Vercel |

---

## Arquitetura

```
instruo/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Perfil do instrutor
│   │   ├── agendar/
│   │   │   ├── page.tsx                # Passo 1 — Tipo de aula
│   │   │   ├── pacote/page.tsx         # Passo 2 — Pacotes
│   │   │   ├── horario/page.tsx        # Passo 3 — Calendário
│   │   │   ├── endereco/page.tsx       # Passo 4 — Endereço
│   │   │   ├── pagamento/page.tsx      # Passo 5 — PIX
│   │   │   └── confirmacao/page.tsx    # Confirmação
│   │   ├── minhas-aulas/
│   │   │   ├── page.tsx                # Acesso por telefone
│   │   │   └── aulas/page.tsx          # Lista de aulas e agendamento
│   │   ├── painel/
│   │   │   ├── login/page.tsx          # Login do instrutor
│   │   │   └── page.tsx                # Painel do instrutor
│   │   └── api/
│   │       ├── instrutor/              # GET dados do instrutor
│   │       ├── agendamentos/           # POST/DELETE agendamentos
│   │       ├── clientes/               # POST upsert cliente
│   │       ├── horarios-ocupados/      # GET horários do mês
│   │       ├── minhas-aulas/           # GET aulas por telefone
│   │       └── pagamentos/
│   │           ├── pix/                # POST gera QR code
│   │           └── webhook/            # POST webhook Mercado Pago
│   ├── lib/
│   │   ├── prisma.ts                   # Singleton do PrismaClient
│   │   └── utils.ts                    # formatarMoeda, cn
│   ├── components/
│   │   └── providers.tsx               # SessionProvider
│   └── middleware.ts                   # Proteção do /painel
├── prisma/
│   ├── schema.prisma                   # Models do banco
│   └── seed.ts                         # Dados iniciais
```

---

## Modelos do banco

```
Instrutor → ContaInstrutor (auth)
          → BairroInstrutor (área de atuação)
          → Veiculo → Pacote
          → Agendamento
          → Bloqueio
          → Disponibilidade

Cliente → Endereco
        → Compra → Agendamento
```

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuito)
- Conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/instruo.git
cd instruo

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Variáveis de ambiente

```env
# Banco de dados (Supabase)
DATABASE_URL="postgresql://postgres:SENHA@db.PROJETO.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="seu-secret-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago
MP_ACCESS_TOKEN="TEST-..."
MP_PUBLIC_KEY="TEST-..."
```

### Banco de dados

```bash
# Cria as tabelas
npx prisma migrate dev

# Popula com dados de teste
npx prisma db seed
```

### Rodando

```bash
npm run dev
```

Acesse **http://localhost:3000**

**Painel do instrutor:** http://localhost:3000/painel/login
- E-mail: `wallif.guedes@instruo.com`
- Senha: `instruo123`

**Minhas aulas:** http://localhost:3000/minhas-aulas
- Telefone: `79999999999`

---

## Fluxo de agendamento

```
Cliente acessa o perfil do instrutor
  → Escolhe tipo de aula (Carro / Moto)
  → Seleciona pacote (Avulsa / 6 aulas / 12 aulas)
  → Escolhe data e horário no calendário
  → Informa endereço de embarque
  → Paga via PIX (QR code gerado pelo Mercado Pago)
  → Recebe confirmação por e-mail
  → Agenda aulas restantes pelo WhatsApp em /minhas-aulas

Instrutor acessa /painel
  → Vê agenda do dia com endereços
  → Acompanha faturamento
```

---

## Decisões técnicas

**Por que Next.js?** Full-stack em um só projeto. API routes no backend, React no frontend, sem separar repositórios.

**Por que Supabase?** PostgreSQL gerenciado com plano gratuito generoso. Integração direta com Prisma.

**Por que Mercado Pago?** PIX nativo, amplamente adotado no Brasil, API em português e split de pagamento para escalar com taxa por agendamento.

**Por que acesso por telefone em Minhas Aulas?** Elimina a fricção de criar conta. O aluno já cadastrou o WhatsApp no pagamento — usar o mesmo número é o caminho mais natural.

---

## Licença

MIT — use, modifique e distribua livremente.

---

Desenvolvido com ☕ e muito `npx prisma migrate dev`.
