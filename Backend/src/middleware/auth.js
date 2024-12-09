const jwt = require("jsonwebtoken");
const prisma = require("../middleware/prisma");

// Generate Auth Token Function
const generateAuthToken = async (user) => {
  // Generate a token using the user's ID
  const token = jwt.sign({ _id: user.id }, "thisissecret");
  // Add the new token to the user's tokens array
  const updatedTokens = [...(user.tokens || []), token];
  // Update the user in the database
  await prisma.user.update({
    where: { id: user.id },
    data: { tokens: updatedTokens },
  });
  return token;
};

const auth = async (request, response, next) => {
  try {
    // Extract token from the request header
    const token = request.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("Token is missing");

    // Verify JWT token
    const decoded = jwt.verify(token, "thisissecret");

    // Query user using Prisma to check if token exists in the `tokens` field
    const user = await prisma.user.findUnique({
      where: {
        id: decoded._id, // Find user by the decoded id
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if token exists in user's tokens
    const tokenExists = user.tokens?.includes(token);

    if (!tokenExists) {
      throw new Error("Invalid token");
    }

    // Pass user and token to the request
    request.user = user;
    request.token = token;

    next();
  } catch (e) {
    console.error("Auth middleware error:", e.message);
    response.status(401).send({ error: "Not valid authentication" });
  }
};

module.exports = { generateAuthToken, auth };
