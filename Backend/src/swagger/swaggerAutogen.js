import swaggerAutogen from "swagger-autogen";

// Configure swagger-autogen
const doc = {
  info: {
    title: "Node.js API Documentation",
    description: "Auto-generated API documentation for the Node.js application",
  },
  host: "localhost:8000",
  schemes: ["http"],
};

const outputFile = "./src/swagger/swagger-output.json";
const endpointsFiles = ["./src/routes/user.routes.js"]; // Add more route files as needed

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated.");
});
