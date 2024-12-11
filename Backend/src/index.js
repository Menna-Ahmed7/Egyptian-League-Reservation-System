const express = require("express");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const managerRouter = require("./routers/manager");

const app = express();
const port = 3000;

// Parses incoming JSON To object
app.use(express.json());
app.use(userRouter);
app.use(adminRouter);
app.use(managerRouter);

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
