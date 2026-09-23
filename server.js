const express = require('express');
const { body, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');

const {
    createProfile,
    findProfileById,
    createTechnology,
    listTechnologies,
    createProject,
    listProjects,
    createFeedback,
    upvoteProject
} = require('./repositories');

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

const swaggerSpec = require('./swagger');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.get('/', (req, res) => {
    res.json({
        message: 'DevShowcase API funcionando!'
    });
});

// =====================================================
// PERFIS
// =====================================================

app.post(
    '/api/profiles',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('O nome é obrigatório.'),

        body('email')
            .isEmail()
            .withMessage('Informe um e-mail válido.'),

        body('bio')
            .optional()
            .isString()
            .withMessage('A bio deve ser um texto.'),

        body('avatarUrl')
            .optional({ nullable: true })
            .isURL()
            .withMessage('O avatarUrl deve ser uma URL válida.')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Erro de validação.',
                    errors: errors.array()
                });
            }

            const input = toProfileInput(req.body);
            const profile = await createProfile(input);

            res.status(201).json(
                toProfileResponse(profile)
            );
        } catch (error) {
            next(error);
        }
    }
);

app.get(
    '/api/profiles/:id',
    async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'O ID do perfil deve ser um número inteiro positivo.'
                });
            }

            const profile = await findProfileById(id);

            if (!profile) {
                return res.status(404).json({
                    message: 'Perfil não encontrado.'
                });
            }

            res.json(
                toProfileResponse(profile)
            );
        } catch (error) {
            next(error);
        }
    }
);

// =====================================================
// TECNOLOGIAS
// =====================================================

app.post(
    '/api/technologies',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('O nome da tecnologia é obrigatório.')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Erro de validação.',
                    errors: errors.array()
                });
            }

            const input = toTechnologyInput(req.body);
            const technology = await createTechnology(input);

            res.status(201).json(
                toTechnologyResponse(technology)
            );
        } catch (error) {
            next(error);
        }
    }
);

app.get(
    '/api/technologies',
    async (req, res, next) => {
        try {
            const technologies = await listTechnologies();

            res.json(
                technologies.map(toTechnologyResponse)
            );
        } catch (error) {
            next(error);
        }
    }
);

// =====================================================
// PROJETOS
// =====================================================

app.post(
    '/api/projects',
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('O título é obrigatório.'),

        body('description')
            .optional()
            .isString()
            .withMessage('A descrição deve ser um texto.'),

        body('url')
            .isURL()
            .withMessage('A URL do projeto deve ser válida.'),

        body('profileId')
            .isInt({ min: 1 })
            .withMessage('O profileId deve ser um número inteiro positivo.'),

        body('technologyIds')
            .isArray({ min: 1 })
            .withMessage('Informe pelo menos uma tecnologia.')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Erro de validação.',
                    errors: errors.array()
                });
            }

            const input = toProjectInput(req.body);
            const project = await createProject(input);

            res.status(201).json(
                toProjectResponse(project)
            );
        } catch (error) {
            next(error);
        }
    }
);

app.get(
    '/api/projects',
    async (req, res, next) => {
        try {
            const technology = req.query.technology || undefined;

            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);

            if (
                !Number.isInteger(page) ||
                page < 1 ||
                !Number.isInteger(limit) ||
                limit < 1
            ) {
                return res.status(400).json({
                    message: 'page e limit devem ser números inteiros positivos.'
                });
            }

            const result = await listProjects({
                technology,
                page,
                limit
            });

            res.json({
                page,
                limit,
                total: result.total,
                projects: result.projects.map(
                    toProjectResponse
                )
            });
        } catch (error) {
            next(error);
        }
    }
);

// =====================================================
// FEEDBACKS
// =====================================================

app.post(
    '/api/projects/:id/feedbacks',
    [
        body('author')
            .trim()
            .notEmpty()
            .withMessage('O autor é obrigatório.'),

        body('comment')
            .trim()
            .notEmpty()
            .withMessage('O comentário é obrigatório.'),

        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('A avaliação deve ser um número entre 1 e 5.')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Erro de validação.',
                    errors: errors.array()
                });
            }

            const projectId = Number(req.params.id);

            if (!Number.isInteger(projectId) || projectId <= 0) {
                return res.status(400).json({
                    message: 'O ID do projeto deve ser um número inteiro positivo.'
                });
            }

            const input = toFeedbackInput({
                ...req.body,
                projectId
            });

            const feedback = await createFeedback(input);

            res.status(201).json(
                toFeedbackResponse(feedback)
            );
        } catch (error) {
            next(error);
        }
    }
);

// =====================================================
// UPVOTE
// =====================================================

app.put(
    '/api/projects/:id/upvote',
    async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'O ID do projeto deve ser um número inteiro positivo.'
                });
            }

            const project = await upvoteProject(id);

            res.json(
                toProjectResponse(project)
            );
        } catch (error) {
            next(error);
        }
    }
);

// =====================================================
// ROTA NÃO ENCONTRADA
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
});

// =====================================================
// TRATAMENTO GLOBAL DE ERROS
// =====================================================

app.use((error, req, res, next) => {
    console.error(error);

    if (error.code === 'P2002') {
        const target = error.meta?.target;

        if (
            Array.isArray(target) &&
            target.includes('email')
        ) {
            return res.status(409).json({
                message: 'Este e-mail já está cadastrado.'
            });
        }

        if (
            Array.isArray(target) &&
            target.includes('name')
        ) {
            return res.status(409).json({
                message: 'Esta tecnologia já está cadastrada.'
            });
        }

        return res.status(409).json({
            message: 'Já existe um registro com esses dados.'
        });
    }

    if (error.code === 'P2025') {
        return res.status(404).json({
            message: 'Registro não encontrado.'
        });
    }

    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        'body' in error
    ) {
        return res.status(400).json({
            message: 'JSON inválido. Verifique o formato dos dados enviados.'
        });
    }

    return res.status(500).json({
        message: 'Erro interno do servidor.'
    });
});

// =====================================================
// SERVIDOR
// =====================================================

app.listen(PORT, () => {
    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
});