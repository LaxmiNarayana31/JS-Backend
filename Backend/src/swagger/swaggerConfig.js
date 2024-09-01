import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" assert { type: "json" }; // Use the generated swagger-output.json

export { swaggerUi, swaggerDocument };
