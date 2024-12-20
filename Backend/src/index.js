const express = require("express");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const managerRouter = require("./routers/manager");
const customerRouter = require("./routers/customer");
const cors = require("cors"); // Import the cors package

const app = express();
const port = 3000;

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
