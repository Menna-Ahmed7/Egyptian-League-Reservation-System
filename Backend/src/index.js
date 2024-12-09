const express = require("express");
const userRouter = require("./routers/user");
const app = express();
const port = 3000;

// Parses incoming JSON To object
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log("Server is up on port" + port);
});