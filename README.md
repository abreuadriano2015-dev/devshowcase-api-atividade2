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

* `server.js` — configura o Express, validações e endpoints da API.
* `repositories.js` — concentra o acesso ao banco de dados utilizando Prisma.
* `dtos.js` — transforma e organiza os dados de entrada e saída da API.
* `swagger.js` — contém a documentação OpenAPI utilizada pelo Swagger.
* `prisma/schema.prisma` — define a estrutura das entidades e seus relacionamentos.
* `prisma/migrations/` — contém as migrações do banco de dados.

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

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

Com o servidor em execução, acesse:

```text
http://localhost:3000/api-docs
```

No Swagger é possível visualizar e testar os endpoints da API diretamente pelo navegador.

## Endpoints

### Profiles

#### Criar perfil

```http
POST /api/profiles
```

Exemplo:

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "bio": "Desenvolvedora backend",
  "avatarUrl": "https://exemplo.com/foto.png"
}
```

#### Buscar perfil por ID

```http
GET /api/profiles/{id}
```

Retorna o perfil e seus projetos relacionados.

---

### Technologies

#### Criar tecnologia

```http
POST /api/technologies
```

Exemplo:

```json
{
  "name": "Node.js"
}
```

#### Listar tecnologias

```http
GET /api/technologies
```

---

### Projects

#### Criar projeto

```http
POST /api/projects
```

Exemplo:

```json
{
  "title": "Meu projeto",
  "description": "Descrição do projeto",
  "url": "https://github.com/usuario/projeto",
  "profileId": 1,
  "technologyIds": [1, 2]
}
```

#### Listar projetos

```http
GET /api/projects
```

A consulta retorna os projetos juntamente com:

* Perfil
* Tecnologias
* Feedbacks
* Média das avaliações
* Quantidade de upvotes

#### Filtrar projetos por tecnologia

Exemplo:

```http
GET /api/projects?technology=JavaScript
```

#### Paginação

Exemplo:

```http
GET /api/projects?page=1&limit=10
```

Também é possível combinar filtro e paginação:

```http
GET /api/projects?technology=JavaScript&page=1&limit=10
```

---

### Feedbacks

#### Criar feedback

```http
POST /api/projects/{id}/feedbacks
```

Exemplo:

```json
{
  "author": "Ana",
  "comment": "Gostei da organização do projeto!",
  "rating": 5
}
```

A avaliação deve ser um número entre **1 e 5**.

Após o cadastro de um feedback, a API recalcula a média das avaliações do projeto.

---

### Upvote

#### Registrar upvote em um projeto

```http
PUT /api/projects/{id}/upvote
```

Esse endpoint incrementa em 1 a quantidade de upvotes do projeto.

Exemplo:

```http
PUT /api/projects/7/upvote
```

Não é necessário enviar corpo na requisição.

## Validações

A API utiliza `express-validator` para validar os dados recebidos.

Entre as validações implementadas estão:

* Nome e e-mail obrigatórios no perfil.
* E-mail válido e único.
* Nome da tecnologia obrigatório e único.
* Título do projeto obrigatório.
* URL do projeto válida.
* Perfil relacionado existente.
* Tecnologias relacionadas existentes.
* Comentário do feedback obrigatório.
* Avaliação do feedback entre 1 e 5.
* IDs recebidos nas rotas devem ser válidos.

## DTOs

O projeto utiliza DTOs para organizar os dados de entrada e saída.

### DTOs de entrada

São responsáveis por transformar os dados recebidos nas requisições antes de enviá-los ao repositório.

### DTOs de saída

Controlam os dados retornados pela API.

Por exemplo, quando um projeto retorna seu perfil relacionado, são apresentados apenas os dados resumidos do perfil, evitando retornar informações desnecessárias.

## Repositories

A camada de repositórios concentra as operações realizadas no banco de dados através do Prisma.

Entre as operações estão:

* Criação e consulta de perfis.
* Criação e listagem de tecnologias.
* Criação e listagem de projetos.
* Criação de feedbacks.
* Atualização da média das avaliações.
* Registro de upvotes.

## Códigos HTTP utilizados

| Código | Significado                    |
| ------ | ------------------------------ |
| 200    | Operação realizada com sucesso |
| 201    | Registro criado com sucesso    |
| 400    | Dados inválidos                |
| 404    | Registro não encontrado        |
| 409    | Registro já existente          |
| 500    | Erro interno do servidor       |

## Testes realizados

Durante o desenvolvimento, os principais endpoints foram testados através do Swagger.

Foram realizados testes de:

* Criação de perfil.
* Consulta de perfil.
* Criação de tecnologia.
* Listagem de tecnologias.
* Criação de projeto.
* Listagem de projetos.
* Filtro por tecnologia.
* Paginação.
* Criação de feedback.
* Atualização da média de avaliações.
* Registro de upvote.

## Exemplo de resultado

Um projeto pode retornar informações como:

```json
{
  "id": 7,
  "title": "Meu projeto Swagger",
  "averageRating": 5,
  "upvotes": 1,
  "profileId": 8,
  "technologies": [
    {
      "id": 1,
      "name": "JavaScript"
    },
    {
      "id": 8,
      "name": "Swagger"
    }
  ]
}
```

## Repositório

Projeto disponível no GitHub:

https://github.com/abreuadriano2015-dev/devshowcase-api-atividade2
