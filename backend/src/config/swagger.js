import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaborFit API',
      version: '1.0.0',
      description: 'API oficial do SaborFit',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Servidor principal',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'saborfit_auth_token',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mensagem de erro' },
            data: { type: 'object', nullable: true },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operação realizada com sucesso' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                session: {
                  type: 'object',
                  properties: {
                    expiresAt: { type: 'string', format: 'date-time' },
                    expiresInSeconds: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@example.com' },
            senha: { type: 'string', example: 'Senha123!' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'maria@example.com' },
            senha: { type: 'string', example: 'Senha123!' },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'maria@example.com' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'senha'],
          properties: {
            token: { type: 'string', example: 'abcdef123456' },
            senha: { type: 'string', example: 'NovaSenha123!' },
          },
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string', example: 'abcdef123456' },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['senhaAtual', 'novaSenha'],
          properties: {
            senhaAtual: { type: 'string', example: 'SenhaAtual123!' },
            novaSenha: { type: 'string', example: 'NovaSenha123!' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            sku: { type: 'string', example: 'SABORFIT-AB12CD' },
            name: { type: 'string', example: 'Suco Detox' },
            description: { type: 'string', example: 'Bebida saudável' },
            price: { type: 'number', format: 'float', example: 19.9 },
            cost_price: { type: 'number', format: 'float', example: 12.5 },
            category_id: { type: 'integer', nullable: true, example: 2 },
            stock_quantity: { type: 'integer', example: 100 },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time', example: '2026-06-14T10:00:00Z' },
            updated_at: { type: 'string', format: 'date-time', example: '2026-06-14T10:00:00Z' },
          },
        },
        ProductRequest: {
          type: 'object',
          required: ['name', 'price', 'cost_price'],
          properties: {
            name: { type: 'string', example: 'Suco Detox' },
            description: { type: 'string', example: 'Bebida saudável' },
            price: { type: 'number', format: 'float', example: 19.9 },
            cost_price: { type: 'number', format: 'float', example: 12.5 },
            category_id: { type: 'integer', nullable: true, example: 2 },
            stock_quantity: { type: 'integer', example: 100 },
            is_active: { type: 'boolean', example: true },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            application: { type: 'string', example: 'SaborFit API' },
            status: { type: 'string', example: 'online' },
          },
        },
        AdminResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
      },
    },
  },
  apis: [
    './src/modules/**/*.js',
    './src/routes/**/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);