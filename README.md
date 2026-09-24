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

O projeto utiliza variáveis de ambiente para configurar as credenciais do banco de dados no ambiente de produção.

O deploy é realizado a partir do repositório GitHub conectado ao Render.

## Endpoints

### Profiles

#### Criar perfil

`POST /api/profiles`

Exemplo de corpo da requisição:

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "bio": "Desenvolvedora backend",
  "avatarUrl": "https://exemplo.com/foto.png"
}
```

#### Buscar perfil por ID

`GET /api/profiles/{id}`

Retorna o perfil e seus projetos relacionados.

---

### Technologies

#### Criar tecnologia

`POST /api/technologies`

Exemplo:

```json
{
  "name": "Node.js"
}
```

#### Listar tecnologias

`GET /api/technologies`

---

### Projects

#### Criar projeto

`POST /api/projects`

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

`GET /api/projects`

A consulta retorna os projetos juntamente com o perfil, as tecnologias, os feedbacks, a média das avaliações e a quantidade de upvotes.

#### Filtrar projetos por tecnologia

Exemplo:

`GET /api/projects?technology=JavaScript`

#### Paginação

Exemplo:

`GET /api/projects?page=1&limit=10`

Também é possível combinar filtro e paginação:

`GET /api/projects?technology=JavaScript&page=1&limit=10`

---

### Feedbacks

#### Criar feedback

`POST /api/projects/{id}/feedbacks`

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

`PUT /api/projects/{id}/upvote`

Exemplo:

`PUT /api/projects/7/upvote`

Esse endpoint incrementa em 1 a quantidade de upvotes do projeto. Não é necessário enviar corpo na requisição.

## Validações

A API utiliza `express-validator` para validar os dados recebidos.

Entre as validações implementadas estão:

* Nome e e-mail obrigatórios no perfil.
* E-mail válido e único.
* Nome da tecnologia obrigatório e único.
* Título do projeto obrigatório.
* URL do projeto válida.
* `profileId` válido.
* `technologyIds` deve conter tecnologias informadas.
* Autor e comentário do feedback obrigatórios.
* Avaliação do feedback entre 1 e 5.
* IDs recebidos nas rotas devem ser números inteiros positivos.

Além das validações de entrada, o Prisma e o banco de dados garantem a integridade dos relacionamentos entre perfis, projetos e tecnologias.

## Tratamento de erros

A API possui tratamento global de exceções para fornecer respostas HTTP adequadas ao cliente.

Entre os casos tratados estão:

* Dados inválidos.
* JSON inválido.
* Registro não encontrado.
* E-mail ou tecnologia duplicados.
* Rotas inexistentes.
* Erros internos do servidor.

## DTOs

O projeto utiliza DTOs para organizar os dados de entrada e saída.

### DTOs de entrada

Transformam os dados recebidos nas requisições antes de enviá-los ao repositório.

### DTOs de saída

Controlam os dados retornados pela API.

Por exemplo, quando um projeto retorna seu perfil relacionado, são apresentados apenas os dados resumidos do perfil, evitando informações desnecessárias.

## Repositories

A camada de repositórios concentra as operações realizadas no banco de dados através do Prisma.

Entre as operações estão:

* Criação e consulta de perfis.
* Criação e listagem de tecnologias.
* Criação e listagem de projetos.
* Filtragem e paginação de projetos.
* Criação de feedbacks.
* Atualização da média das avaliações.
* Registro de upvotes.

## Códigos HTTP utilizados

| Código | Significado                     |
| ------ | ------------------------------- |
| 200    | Operação realizada com sucesso  |
| 201    | Registro criado com sucesso     |
| 400    | Dados inválidos                 |
| 404    | Registro ou rota não encontrada |
| 409    | Registro já existente           |
| 500    | Erro interno do servidor        |

## Testes realizados

Durante o desenvolvimento e a publicação, os principais endpoints foram testados através do Swagger, tanto no ambiente local quanto no ambiente de produção.

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
* Validações de entrada.
* Tratamento de erros.
* Swagger em produção.
* Persistência dos dados no PostgreSQL de produção.

## Resultado testado em produção

Durante os testes realizados no ambiente de produção, a API apresentou:

* Projeto cadastrado com sucesso.
* Tecnologia `JavaScript` relacionada ao projeto.
* Dois feedbacks cadastrados.
* Média das avaliações calculada em **4,5**.
* **1 upvote** registrado.
* Filtro por `JavaScript` retornando o projeto corretamente.
* HTTP **200** na consulta do projeto filtrado.

Exemplo simplificado:

```json
{
  "id": 1,
  "title": "Meu projeto em produção",
  "averageRating": 4.5,
  "upvotes": 1,
  "profileId": 1,
  "technologies": [
    {
      "id": 1,
      "name": "JavaScript"
    }
  ]
}
```

## Repositório

Projeto disponível no GitHub:

https://github.com/abreuadriano2015-dev/devshowcase-api-atividade2

