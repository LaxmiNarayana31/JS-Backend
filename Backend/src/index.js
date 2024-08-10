// require('dotenv').config({path: './env'}) -> It works but not maintain consistency

import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });

// "IIFE" stands for "Immediately Invoked Function Expression". It's a way to execute a function as soon as it's defined in JavaScript.
// Approach-1

/*

(async () => {
  try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      app.on("error", (error) => {
          console.error("ERROR:", error);
          throw error
      })
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("ERROR:", error);
  }
})();

*/
