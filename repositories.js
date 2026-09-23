const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// =====================================================
// Repositório de Perfis
// =====================================================

function createProfile(data) {
    return prisma.profile.create({
        data
    });
}

function findProfileById(id) {
    return prisma.profile.findUnique({
        where: { id },
        include: {
            projects: true
        }
    });
}

// =====================================================
// Repositório de Tecnologias
// =====================================================

function createTechnology(data) {
    return prisma.technology.create({
        data
    });
}

function listTechnologies() {
    return prisma.technology.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

// =====================================================
// Repositório de Projetos
// =====================================================

function createProject({
    title,
    description,
    url,
    profileId,
    technologyIds
}) {
    return prisma.project.create({
        data: {
            title,
            description,
            url,

            profile: {
                connect: {
                    id: profileId
                }
            },

            technologies: {
                connect: technologyIds.map(id => ({ id }))
            }
        },

        include: {
            profile: true,
            technologies: true,
            feedbacks: true
        }
    });
}

// Listar projetos com filtro por tecnologia e paginação
async function listProjects({
    technology,
    page = 1,
    limit = 10
} = {}) {
    const where = technology
        ? {
            technologies: {
                some: {
                    name: {
                        equals: technology,
                        mode: 'insensitive'
                    }
                }
            }
        }
        : {};

    const projects = await prisma.project.findMany({
        where,

        skip: (page - 1) * limit,
        take: limit,

        include: {
            profile: true,
            technologies: true,
            feedbacks: true
        },

        orderBy: {
            id: 'asc'
        }
    });

    const total = await prisma.project.count({
        where
    });

    return {
        projects,
        total
    };
}

// =====================================================
// Repositório de Feedbacks
// =====================================================

async function createFeedback({
    projectId,
    author,
    comment,
    rating
}) {
    return prisma.$transaction(async (transaction) => {

        // Cria o feedback
        const feedback = await transaction.feedback.create({
            data: {
                author,
                comment,
                rating,

                project: {
                    connect: {
                        id: projectId
                    }
                }
            }
        });

        // Calcula a média das avaliações do projeto
        const result = await transaction.feedback.aggregate({
            where: {
                projectId
            },

            _avg: {
                rating: true
            }
        });

        const averageRating = result._avg.rating ?? 0;

        // Atualiza a média no projeto
        await transaction.project.update({
            where: {
                id: projectId
            },

            data: {
                averageRating
            }
        });

        return feedback;
    });
}

// =====================================================
// Repositório de Curtidas
// =====================================================

function upvoteProject(id) {
    return prisma.project.update({
        where: {
            id
        },

        data: {
            upvotes: {
                increment: 1
            }
        },

        include: {
            profile: true,
            technologies: true,
            feedbacks: true
        }
    });
}

// =====================================================
// Exportações
// =====================================================

module.exports = {
    createProfile,
    findProfileById,

    createTechnology,
    listTechnologies,

    createProject,
    listProjects,

    createFeedback,
    upvoteProject
};