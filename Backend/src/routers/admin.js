const { generateAuthToken, auth } = require("../middleware/auth");
const express = require("express");
const prisma = require("../middleware/prisma");
const router = new express.Router();
const bcrypt = require("bcryptjs");

// Resource Creation
router.get("/getAllUsers", auth, async (request, response) => {
  // console.log(request.body);
  try {
    if (request.user.role === "Admin") {
      const users = await prisma.user.findMany({
        where: {
          role: "Fan",
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          emailAddress: true,
        },
      });
      response.send(users);
    } else
      response.status(403).send({ error: "You're not allowed to access this" });
    // console.log("User created successfully:", user);
  } catch (error) {
    if (Object.keys(error).length === 0)
      response.status(400).send({ error: error });
    else response.status(400).send({ error: error.message });
    console.log(error);
  }
});

router.get("/getManagers", auth, async (request, response) => {
  // console.log(request.body);
  try {
    if (request.user.role === "Admin") {
      const users = await prisma.user.findMany({
        where: {
          role: "Manager",
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          emailAddress: true,
        },
      });
      response.send(users);
    } else
      response.status(403).send({ error: "You're not allowed to access this" });
    // console.log("User created successfully:", user);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });

    console.log(error);
  }
});

router.delete("/deleteUser/:id", auth, async (request, response) => {
  // console.log(request.body);
  const id = request.params.id;
  try {
    if (request.user.role === "Admin") {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        return response
          .status(404)
          .send({ error: `User with id ${id} not found` });
      }

      // Delete the user if found
      await prisma.user.delete({
        where: {
          id: id,
        },
      });

      response.send({ success: `User with id ${id} deleted successfully` });
    } else
      response.status(403).send({ error: "You're not allowed to access this" });
    // console.log("User created successfully:", user);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });

    console.log(error);
  }
});

router.post("/setAsManager/:id", auth, async (request, response) => {
  // console.log(request.body);
  const id = request.params.id;
  try {
    if (request.user.role === "Admin") {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        return response
          .status(404)
          .send({ error: `User with id ${id} not found` });
      }

      if (user.role === "Manager") {
        return response
          .status(404)
          .send({ error: `User is already a manager` });
      }
      // Update the user if found
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          role: "Manager",
        },
      });

      response.send({ success: `User with id ${id} is now a manager` });
    } else
      response.status(403).send({ error: "You're not allowed to access this" });
    // console.log("User created successfully:", user);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });

    console.log(error);
  }
});

module.exports = router;
