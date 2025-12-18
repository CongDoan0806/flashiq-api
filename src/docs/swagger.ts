import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDocument = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FlashIQ API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000/api/v1' }],
  },
  apis: ['./src/app/**/*.yaml', './src/docs/*.yaml'],
};

export const specs = swaggerJsdoc(swaggerDocument);
