// =====================================================
// DTOs de ENTRADA
// =====================================================

function toProfileInput(body) {
    return {
        name: body.name,
        email: body.email,
        bio: body.bio || null,
        avatarUrl: body.avatarUrl || null
    };
}

function toTechnologyInput(body) {
    return {
        name: body.name
    };
}

function toProjectInput(body) {
    return {
        title: body.title,
        description: body.description || null,
        url: body.url,
        profileId: Number(body.profileId),
        technologyIds: [
            ...new Set(
                (body.technologyIds || []).map(Number)
            )
        ]
    };
}

function toFeedbackInput(body) {
    return {
        projectId: Number(body.projectId),
        author: body.author,
        comment: body.comment,
        rating: Number(body.rating)
    };
}

// =====================================================
// DTOs de SAÍDA
// =====================================================

function toTechnologyResponse(technology) {
    return {
        id: technology.id,
        name: technology.name
    };
}

function toFeedbackResponse(feedback) {
    return {
        id: feedback.id,
        author: feedback.author,
        comment: feedback.comment,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
        projectId: feedback.projectId
    };
}

// =====================================================
// Perfil resumido
// =====================================================

function toProfileSummaryResponse(profile) {
    return {
        id: profile.id,
        name: profile.name,
        avatarUrl: profile.avatarUrl
    };
}

// =====================================================
// Resposta de projeto
// =====================================================

function toProjectResponse(project) {
    const response = {
        id: project.id,
        title: project.title,
        description: project.description,
        url: project.url,
        createdAt: project.createdAt,
        profileId: project.profileId,

        averageRating: project.averageRating,
        upvotes: project.upvotes
    };

    if (project.profile) {
        response.profile =
            toProfileSummaryResponse(project.profile);
    }

    if (project.technologies) {
        response.technologies =
            project.technologies.map(
                toTechnologyResponse
            );
    }

    if (project.feedbacks) {
        response.feedbacks =
            project.feedbacks.map(
                toFeedbackResponse
            );
    }

    return response;
}

// =====================================================
// Resposta de perfil
// =====================================================

function toProfileResponse(profile) {
    const response = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        createdAt: profile.createdAt
    };

    if (profile.projects) {
        response.projects =
            profile.projects.map(
                toProjectResponse
            );
    }

    return response;
}

// =====================================================
// Exportações
// =====================================================

module.exports = {
    toProfileInput,
    toTechnologyInput,
    toProjectInput,
    toFeedbackInput,
    toProfileResponse,
    toTechnologyResponse,
    toProjectResponse,
    toFeedbackResponse
};