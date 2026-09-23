const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DevShowcase API',
            version: '1.0.0',
            description:
                'API para gerenciamento de perfis, projetos, tecnologias e feedbacks.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
        paths: {
            '/': {
                get: {
                    summary: 'Verificar funcionamento da API',
                    responses: {
                        200: {
                            description: 'API funcionando'
                        }
                    }
                }
            },

            '/api/profiles': {
                post: {
                    summary: 'Criar perfil',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            example: 'Adriano Abreu'
                                        },
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            example: 'adriano.teste@example.com'
                                        },
                                        bio: {
                                            type: 'string',
                                            example:
                                                'Estudante de Tecnologia em Sistemas para Internet'
                                        },
                                        avatarUrl: {
                                            type: 'string',
                                            format: 'uri',
                                            example:
                                                'https://exemplo.com/avatar.jpg'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Perfil criado com sucesso'
                        },
                        400: {
                            description: 'Dados inválidos'
                        },
                        409: {
                            description: 'E-mail já cadastrado'
                        }
                    }
                }
            },

            '/api/profiles/{id}': {
                get: {
                    summary: 'Consultar perfil por ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'integer'
                            },
                            example: 1
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Perfil encontrado'
                        },
                        400: {
                            description: 'ID inválido'
                        },
                        404: {
                            description: 'Perfil não encontrado'
                        }
                    }
                }
            },

            '/api/technologies': {
                post: {
                    summary: 'Cadastrar tecnologia',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            example: 'JavaScript'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Tecnologia criada com sucesso'
                        },
                        400: {
                            description: 'Dados inválidos'
                        },
                        409: {
                            description: 'Tecnologia já cadastrada'
                        }
                    }
                },

                get: {
                    summary: 'Listar tecnologias',
                    responses: {
                        200: {
                            description: 'Lista de tecnologias'
                        }
                    }
                }
            },

            '/api/projects': {
                post: {
                    summary: 'Criar projeto',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: [
                                        'title',
                                        'description',
                                        'profileId'
                                    ],
                                    properties: {
                                        title: {
                                            type: 'string',
                                            example: 'Meu primeiro projeto'
                                        },
                                        description: {
                                            type: 'string',
                                            example:
                                                'Projeto desenvolvido para a atividade DevShowcase API.'
                                        },
                                        profileId: {
                                            type: 'integer',
                                            example: 1
                                        },
                                        repositoryUrl: {
                                            type: 'string',
                                            format: 'uri',
                                            example:
                                                'https://github.com/usuario/projeto'
                                        },
                                        demoUrl: {
                                            type: 'string',
                                            format: 'uri',
                                            example:
                                                'https://exemplo.com/projeto'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Projeto criado com sucesso'
                        },
                        400: {
                            description: 'Dados inválidos'
                        }
                    }
                },

                get: {
                    summary: 'Listar projetos',
                    parameters: [
                        {
                            name: 'technology',
                            in: 'query',
                            required: false,
                            schema: {
                                type: 'string'
                            },
                            example: 'JavaScript'
                        },
                        {
                            name: 'page',
                            in: 'query',
                            required: false,
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                default: 1
                            }
                        },
                        {
                            name: 'limit',
                            in: 'query',
                            required: false,
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 100,
                                default: 10
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista paginada de projetos'
                        }
                    }
                }
            },

            '/api/projects/{id}/feedbacks': {
                post: {
                    summary: 'Criar feedback para um projeto',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'integer'
                            },
                            example: 1
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['comment', 'rating'],
                                    properties: {
                                        comment: {
                                            type: 'string',
                                            example:
                                                'Projeto muito interessante!'
                                        },
                                        rating: {
                                            type: 'integer',
                                            minimum: 1,
                                            maximum: 5,
                                            example: 5
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Feedback criado com sucesso'
                        },
                        400: {
                            description: 'Dados inválidos'
                        }
                    }
                }
            },

            '/api/projects/{id}/upvote': {
                put: {
                    summary: 'Adicionar upvote a um projeto',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'integer'
                            },
                            example: 1
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Upvote registrado com sucesso'
                        },
                        400: {
                            description: 'ID inválido'
                        },
                        404: {
                            description: 'Projeto não encontrado'
                        }
                    }
                }
            }
        }
    },

    apis: []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
