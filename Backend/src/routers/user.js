const { generateAuthToken, auth } = require("../middleware/auth");
const express = require("express");
const prisma = require("../middleware/prisma");
const router = new express.Router();
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - firstName
 *         - lastName
 *         - birthDate
 *         - gender
 *         - City
 *         - Address
 *         - emailAddress
 *         - role
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         City:
 *           type: string
 *         Address:
 *           type: string
 *         emailAddress:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [Admin, Fan, Manager]
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         emailAddress:
 *           type: string
 *         role:
 *           type: string
 *           enum: [Admin, Fan, Manager]
 *     LoginRequest:
 *       type: object
 *       required:
 *         - emailAddress
 *         - password
 *       properties:
 *         emailAddress:
 *           type: string
 *         password:
 *           type: string
 */
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request (user already exists or invalid input)
 */

router.post("/signup", async (request, response) => {
  // console.log(request.body);
  try {
    const user = await prisma.user.create({
      data: {
        username: request.body.username,
        password: request.body.password,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        birthDate: new Date(request.body.birthDate), // Convert ISO string to Date
        gender: request.body.gender,
        City: request.body.City,
        Address: request.body.Address,
        emailAddress: request.body.emailAddress,
        role: request.body.role,
        tokens: [], // Initialize with an empty array
      },
    });
    const token = await generateAuthToken(user);
    const { password, tokens, ...safeUser } = user; // Destructure to exclude sensitive fields
    response.status(201).send({ user: safeUser, token });
    // console.log("User created successfully:", user);
  } catch (error) {
    if (error.code === "P2002") {
      const target = error.meta.target; // Get the unique field causing the error
      const field = target.includes("username")
        ? "username"
        : target.includes("emailAddress")
        ? "email address"
        : "unknown field";

      return response.status(400).send({
        error: `The ${field} already exists. Please use a different one.`,
      });
    }
    response.status(400).send({ error: error.message });

    console.error("Error creating user:", error.message);
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid email or password
 */
router.post("/login", async (request, response) => {
  // console.log(request.body);
  try {
    const requiredFields = ["emailAddress", "password"];

    // Check if all required fields are present in the request body
    for (const field of requiredFields) {
      if (!(field in request.body)) {
        return response
          .status(400)
          .send({ error: `Missing required field: ${field}` });
      }
    }
    const user = await prisma.user.findUnique({
      where: {
        emailAddress: request.body.emailAddress,
      },
    });
    if (!user) throw new Error("User not found");
    const match = await bcrypt.compare(request.body.password, user.password);
    if (!match) throw new Error("Wrong password");

    const token = await generateAuthToken(user);
    const { password, tokens, ...safeUser } = user; // Destructure to exclude sensitive fields
    response.status(201).send({ user: safeUser, token });
    // console.log("User created successfully:", user);
  } catch (error) {
    response.status(400).send({ error: error.message });

    console.error("Error Logging:", error.message);
  }
});
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       400:
 *         description: Logout failed due to server error
 */
router.post("/logout", auth, async (request, response) => {
  try {
    // remove tokens not equal this
    const updatedTokens = request.user.tokens.filter(
      (token) => token !== request.token
    );
    // Update the database
    await prisma.user.update({
      where: { id: request.user.id },
      data: {
        tokens: updatedTokens,
      },
    });
    response.send({ message: "Logged out successfully" });
  } catch (e) {
    response.status(400).send({ error: e.message});
  }
});
module.exports = router;
