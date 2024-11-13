import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Teste',
            version: '1.0.0',
            description: `API destinada ao teste.
            
Todas as respostas de sucesso ou erro seguirão o padrão do objeto 'ApiResponse', que contém as seguintes propriedades:
- **mensagem**: Detalhes da operação realizada
- **obs**: Observações adicionais, se houverem
- **status**: Código de status HTTP da resposta

**Exceção**: O status 401 será retornado quando houver uma falha na autenticação básica (Basic Auth). Nesses casos, a resposta será específica para indicar que o usuário não está autorizado.
            
Esse objeto será utilizado em todas as respostas da API, independentemente do status HTTP.`,
        },
        components: {
            securitySchemes: {
                basicAuth: {
                    type: 'http',
                    scheme: 'basic',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        mensagem: {
                            type: 'string',
                            example: 'Operação realizada com sucesso',
                        },
                        obs: {
                            type: 'string',
                            example: 'Nenhuma observação adicional',
                        },
                        status: {
                            type: 'integer',
                            example: 200,
                        },
                    },
                },
            },
            responses: {
                DefaultResponse: {
                    description: 'Resposta padrão para qualquer status',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ApiResponse',
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                basicAuth: [],
            },
        ],
    },
    apis: [
        path.join(__dirname, 'entidades', 'categorias', 'CategoriaSwagger.yaml'),
        path.join(__dirname, 'entidades', 'categoriasFilhas', 'CategoriaFilhaSwagger.yaml'),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger docs available at /api-docs');
};
