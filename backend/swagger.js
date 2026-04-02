const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Necronomi\'Con API',
            version: '1.0.0',
            description: 'API Documentation for Necronomi\'Con backend.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
        tags: [
            { name: 'Auth', description: 'Authentication and Registration' },
            { name: 'Users', description: 'User Profile and Management' },
            { name: 'Stats', description: 'Dashboard Statistics' },
        ],
    },
    apis: ['./routes/*.js'], // Files containing Swagger annotations
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};
