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
  },
  apis: [
    './src/modules/**/*.js',
    './src/routes/**/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);