const express = require("express");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const managerRouter = require("./routers/manager");
const customerRouter = require("./routers/customer");
const cors = require("cors"); // Import the cors package
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Swagger definition options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "Your API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication related APIs (Login, Logout, etc.)',
      },
      {
        name: 'Admin',
        description: 'Admin related APIs (Signup, Profile, etc.)',
      },
      {
        name: 'User',
        description: 'User related APIs (Profile, Info, etc.)'},
      {
        name: 'Reservation',
        description: 'Reservation related APIs (Reserve, Cancel, etc.)',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routers/*.js"],
};


// Initialize Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Parses incoming JSON To object
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(adminRouter);
app.use(managerRouter);
app.use(customerRouter);

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
