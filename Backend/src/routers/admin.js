const { generateAuthToken, auth } = require("../middleware/auth");
const express = require("express");
const prisma = require("../middleware/prisma");
const router = new express.Router();
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /getAllUsers:
 *   get:
 *     summary: Retrieve all users with role "Fan"
 *     description: Only accessible by Admins, returns a list of users with the "Fan" role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   emailAddress:
 *                     type: string
 *       403:
 *         description: Unauthorized access
 */
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
/**
 * @swagger
 * /getManagers:
 *   get:
 *     summary: Retrieve all users with role "Manager"
 *     description: Only accessible by Admins, returns a list of users with the "Manager" role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of managers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   emailAddress:
 *                     type: string
 *       403:
 *         description: Unauthorized access
 */
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
/**
 * @swagger
 * /deleteUser/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user if they exist. Only Admins can perform this action.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *       404:
 *         description: User not found
 *       403:
 *         description: Unauthorized access
 */
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
/**
 * @swagger
 * /setAsManager/{id}:
 *   post:
 *     summary: Promote a user to manager
 *     description: Changes a user's role to "Manager". Only Admins can perform this action.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to promote
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *       404:
 *         description: User not found or already a manager
 *       403:
 *         description: Unauthorized access
 */
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
