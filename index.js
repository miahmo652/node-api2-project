const express = require("express");
const postsRouter = require("./Posts/post-router");

const server = express();
const port = 5000;

server.use(express.json());


server.use(postsRouter)

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});