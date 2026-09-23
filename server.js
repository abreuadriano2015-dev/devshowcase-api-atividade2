const express = require('express');
const { body, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');

const repositories = require('./repositories');
const swaggerSpec = require('./swagger');

const {
    toProfileInput,
    toTechnologyInput,
    toProjectInput,
    toFeedbackInput,
    toProfileResponse,
    toTechnologyResponse,
    toProjectResponse,
    toFeedbackResponse
} = require('./dtos');

const app = express();

const PORT = 3000;

app.use(express.json());

// =====================================================
// Swagger
// =====================================================

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// =====================================================
// Rota inicial
// =====================================================

app.get('/', (req, res) => {
    res.json({
        message: 'DevShowcase API funcionando!'
    });
});

// =====================================================
// POST /api/profiles
// Criar perfil
// =====================================================

app.post(
    '/api/profiles',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('O nome é obrigatório.'),

        body('email')
            .trim()
            .isEmail()
            .withMessage('Informe um e-mail válido.'),

        body('avatarUrl')
            .optional({ checkFalsy: true })
            .trim()
            .isURL({
                protocols: ['http', 'https'],
                require_protocol: true
            })
            .withMessage('Informe uma URL de avatar válida.')
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const data = toProfileInput(req.body);

        try {
            const profile = await repositories.createProfile(data);

            return res.status(201).json(
                toProfileResponse(profile)
            );
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    message: 'Este e-mail já está cadastrado.'
                });
            }

            console.error(error);

            return res.status(500).json({
                message: 'Erro interno ao criar o perfil.'
            });
        }
    }
);

// =====================================================
// GET /api/profiles/:id
// Consultar perfil por ID
// =====================================================

app.get('/api/profiles/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'ID inválido.'
        });
    }

    try {
        const profile = await repositories.findProfileById(id);

        if (!profile) {
            return res.status(404).json({
                message: 'Perfil não encontrado.'
            });
        }

        return res.json(
            toProfileResponse(profile)
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erro interno ao consultar o perfil.'
        });
    }
});

// =====================================================
// POST /api/technologies
// Cadastrar tecnologia
// =====================================================

app.post(
    '/api/technologies',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('O nome da tecnologia é obrigatório.')
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const data = toTechnologyInput(req.body);

        try {
            const technology = await repositories.createTechnology(data);

            return res.status(201).json(
                toTechnologyResponse(technology)
            );
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    message: 'Esta tecnologia já está cadastrada.'
                });
            }

            console.error(error);

            return res.status(500).json({
                message: 'Erro interno ao criar a tecnologia.'
            });
        }
    }
);

// =====================================================
// GET /api/technologies
// Listar tecnologias
// =====================================================

app.get('/api/technologies', async (req, res) => {
    try {
        const technologies = await repositories.listTechnologies();

        return res.json(
            technologies.map(toTechnologyResponse)
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erro interno ao consultar as tecnologias.'
        });
    }
});

// =====================================================
// POST /api/projects
// Criar projeto
// =====================================================

app.post(
    '/api/projects',
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('O título é obrigatório.'),

        body('description')
            .trim()
            .notEmpty()
            .withMessage('A descrição é obrigatória.'),

        body('profileId')
            .isInt({ min: 1 })
            .withMessage('O profileId deve ser um número inteiro positivo.'),

        body('repositoryUrl')
            .optional({ checkFalsy: true })
            .trim()
            .isURL({
                protocols: ['http', 'https'],
                require_protocol: true
            })
            .withMessage('Informe uma URL de repositório válida.'),

        body('demoUrl')
            .optional({ checkFalsy: true })
            .trim()
            .isURL({
                protocols: ['http', 'https'],
                require_protocol: true
            })
            .withMessage('Informe uma URL de demonstração válida.')
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const data = toProjectInput(req.body);

        try {
            const project = await repositories.createProject(data);

            return res.status(201).json(
                toProjectResponse(project)
            );
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno ao criar o projeto.'
            });
        }
    }
);

// =====================================================
// GET /api/projects
// Listar projetos com filtro e paginação
// =====================================================

app.get('/api/projects', async (req, res) => {
    try {
        const technology = req.query.technology;

        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const result = await repositories.listProjects({
            technology,
            page,
            limit
        });

        return res.json({
            page,
            limit,
            total: result.total,
            projects: result.projects.map(toProjectResponse)
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erro interno ao consultar os projetos.'
        });
    }
});

// =====================================================
// POST /api/projects/:id/feedbacks
// Criar feedback
// =====================================================

app.post(
    '/api/projects/:id/feedbacks',
    [
        body('comment')
            .trim()
            .notEmpty()
            .withMessage('O comentário é obrigatório.'),

        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('A avaliação deve ser um número entre 1 e 5.')
    ],
    async (req, res) => {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: 'ID do projeto inválido.'
            });
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const data = toFeedbackInput({
            ...req.body,
            projectId
        });

        try {
            const feedback = await repositories.createFeedback(data);

            return res.status(201).json(
                toFeedbackResponse(feedback)
            );
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno ao criar o feedback.'
            });
        }
    }
);

// =====================================================
// PUT /api/projects/:id/upvote
// Incrementar upvotes do projeto
// =====================================================

app.put('/api/projects/:id/upvote', async (req, res) => {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
            message: 'ID do projeto inválido.'
        });
    }

    try {
        const project = await repositories.upvoteProject(projectId);

        if (!project) {
            return res.status(404).json({
                message: 'Projeto não encontrado.'
            });
        }

        return res.json(
            toProjectResponse(project)
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erro interno ao registrar o upvote.'
        });
    }
});

// =====================================================
// Inicialização do servidor
// =====================================================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});