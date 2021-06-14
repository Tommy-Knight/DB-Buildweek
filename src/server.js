import express from "express";
import cors from "cors";
import db from "./db/db.js";
import experienceRouter from "./services/experiences/experience.js";
import profileRouter from "./services/profiles/user.js";
import postsRouter from "./services/posts/posts.js";
import listEndpoints from "express-list-endpoints";

const server = express();
const port = 5000;

server.use(cors());
server.use(express.json());

server.use("/profile", profileRouter);
server.use("/experience", experienceRouter);
server.use("/posts", postsRouter);

db.sync({ alter: true })
  .then(() => {
    server.listen(port, () => {
      console.table(listEndpoints(server));
      console.log(`Server is HAPPY on port: ${port} 👍`);
    });
    server.on("error", (error) =>
      console.info(`Server is SAD with: ${error} 👎`)
    );
  })
  .catch((error) => console.log(error));