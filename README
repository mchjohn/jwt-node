# jwt-node

Projeto de exemplo em TypeScript que implementa o fluxo de autenticação (SignUp / SignIn) com JWT e persistência via Prisma (Postgres).

**Visão geral**
- Código organizado em `useCases` + `controllers`. A lógica de SignUp cria contas com senha hasheada (bcryptjs). SignIn valida credenciais e emite um JWT (`jsonwebtoken`) com validade de 2 dias.
- Banco: PostgreSQL via Prisma. Modelo principal: `Account` (id, name, email, password).

**Stack**
- Node.js + TypeScript
- Prisma + PostgreSQL
- `bcryptjs` para hashing de senhas
- `jsonwebtoken` para geração de tokens
- `zod` para validação de entrada

**Requisitos**
- Node.js (recomendado 18+)
- PostgreSQL
- `npm` ou `pnpm`

**Variáveis de ambiente**
Crie um arquivo `.env` na raiz com pelo menos as seguintes variáveis:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="uma_chave_secreta_segura"
```

As variáveis são lidas pelo arquivo `src/config/env.ts`.

**Instalação e preparação**

1. Instale dependências:

```bash
npm install
```

2. Gere o cliente Prisma (opcionalmente já está gerado no build):

```bash
npx prisma generate
```

3. Aplique as migrações (desenvolvimento):

```bash
npx prisma migrate dev --name init
```

Para ambientes de produção use:

```bash
npx prisma migrate deploy
```

Se preferir empurrar o schema sem migrations:

```bash
npx prisma db push
```

**Scripts úteis** (em `package.json`)

- `npm run dev` : inicia o projeto em modo desenvolvimento (usa `ts-node-dev` e `src/index.ts` como entrypoint se existir)
- `npm run build` : compila TypeScript
- `npm run format` : formata com `biome`
- `npm run lint` : verifica/arruma lint
