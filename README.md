# DevShowcase API

API REST desenvolvida para a Atividade 2 da disciplina de Programação Backend. O projeto permite cadastrar perfis de desenvolvedores, projetos, tecnologias e feedbacks, além de consultar projetos com filtros, paginação e registrar upvotes.

## Identificação do grupo

* **Curso:** Tecnologia em Sistemas para Internet
* **Polo:** Olho d'Água do Piauí - PI
* **Disciplina:** Programação Backend

### Integrantes

* Adriano Carvalho de Abreu
* Marcos Venicios de Paiva
* Washington Heles Pereira da Silva Filho

## Tecnologias utilizadas

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* express-validator
* Swagger / OpenAPI

## Modelagem

A API possui quatro entidades principais:

* **Profile** — representa o perfil do desenvolvedor.
* **Project** — representa os projetos cadastrados.
* **Technology** — representa as tecnologias utilizadas nos projetos.
* **Feedback** — representa avaliações e comentários sobre os projetos.

### Relacionamentos

| Relacionamento       | Tipo  |
| -------------------- | ----- |
| Profile → Project    | 1 : N |
| Project ↔ Technology | N : N |
| Project → Feedback   | 1 : N |

A modelagem completa está disponível em:

```text
prisma/schema.prisma
```

## Estrutura do projeto

```text
devshowcase-api-atividade2/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── dtos.js
├── repositories.js
├── server.js
├── swagger.js
├── prisma.config.ts
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

### Responsabilidade dos arquivos

* `server.js` — configura o Express, validações, endpoints da API e tratamento global de erros.
* `repositories.js` — concentra o acesso ao banco de dados utilizando Prisma.
* `dtos.js` — transforma e organiza os dados de entrada e saída da API.
* `swagger.js` — contém a documentação OpenAPI utilizada pelo Swagger.
* `prisma/schema.prisma` — define a estrutura das entidades e seus relacionamentos.
* `prisma/migrations/` — contém as migrações do banco de dados.

## Pré-requisitos

Antes de executar o projeto localmente, é necessário ter instalado:

* Node.js
* npm
* PostgreSQL

## Instalação

Clone o repositório:

```bash
git clone https://github.com/abreuadriano2015-dev/devshowcase-api-atividade2.git
```

Entre na pasta:

```bash
cd devshowcase-api-atividade2
```

Instale as dependências:

```bash
npm install
```

## Configuração do banco de dados

Crie um banco de dados PostgreSQL chamado:

```text
devshowcase
```

Depois, crie o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/devshowcase"
```

Substitua `USUARIO` e `SENHA` pelos dados do seu PostgreSQL.

## Migração do banco

Execute:

```bash
npx prisma migrate dev
```

O Prisma criará as tabelas conforme o arquivo `schema.prisma`.

## Executando a API

Inicie o servidor:

```bash
node server.js
```

A API estará disponível em:

```text
http://localhost:3000
```

A rota inicial pode ser acessada em:

```text
http://localhost:3000/
```

## Swagger

A API possui documentação e interface de testes utilizando Swagger.

Com o servidor local em execução, acesse:

```text
http://localhost:3000/api-docs
```

No Swagger é possível visualizar e testar os endpoints da API diretamente pelo navegador.

## Produção

A API foi publicada utilizando o Render, com banco de dados PostgreSQL em ambiente de produção.

### API em produção

```text
https://devshowcase-api-atividade2-diux.onrender.com
```

### Swagger em produção

```text
https://devshowcase-api-atividade2-diux.onrender.com/api-docs
```

O projeto utiliza variáveis de
