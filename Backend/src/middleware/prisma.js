const { PrismaClient } = require("@prisma/client");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
// Middleware to validate data
prisma.$use(async (params, next) => {
  if (
    params.model === "User" &&
    (params.action === "create" || params.action === "update")
  ) {
    const data = params.args.data;

    // Validate username (it should not be empty and be alphanumeric)
    if (data.username && !validator.isAlphanumeric(data.username)) {
      throw new Error("Username must be alphanumeric");
    }

    // Validate password (it should not be empty and at least 6 characters)
    if (
      data.password &&
      !validator.isStrongPassword(data.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 1,
      })
    ) {
      throw new Error(
        "Password must be at least 8 characters long, with at least 1 UpperCase, 1 LowerCase and 1 Symbol"
      );
    } else if (data.password) {
      //encrypt password
      data.password = await bcrypt.hash(data.password, 8);
    }

    // Validate firstName and lastName (should not be empty)
    if (data.firstName && !validator.isLength(data.firstName, { min: 1 })) {
      throw new Error("First name cannot be empty");
    }
    if (data.lastName && !validator.isLength(data.lastName, { min: 1 })) {
      throw new Error("Last name cannot be empty");
    }

    // Validate birthDate (must be a valid date)
    console.log(data.birthDate)
    if (
      data.birthDate &&
      !validator.isDate(data.birthDate.toISOString().split("T")[0])
    ) {
      throw new Error("Invalid birth date");
    }
    const currentDate = new Date();

    if (data.birthDate && data.birthDate > currentDate) {
      throw new Error("The birthDate cannot be in the future");
    }
    // Validate gender (must be one of Male, Female, or Other)
    if (data.gender && !["Male", "Female"].includes(data.gender)) {
      throw new Error("Gender must be Male, Female");
    }

    // Validate emailAddress (must be a valid email)
    if (data.emailAddress && !validator.isEmail(data.emailAddress)) {
      throw new Error("Invalid email address");
    }

    // Validate role (must be one of Fan, Manager, Admin)
    if (data.role && !["Fan", "Manager", "Admin"].includes(data.role)) {
      throw new Error("Role must be one of Fan, Manager, Admin");
    }

    // Validate City and Address (ensure they are not empty if provided)
    if (data.City && validator.isEmpty(data.City)) {
      throw new Error("City cannot be empty");
    }
    if (data.Address && validator.isEmpty(data.Address)) {
      throw new Error("Address cannot be empty");
    }

    // Validate tokens (ensure it's an array of strings, no further validation needed)
    if (data.tokens && !Array.isArray(data.tokens)) {
      throw new Error("Tokens should be an array");
    }
  }

  return next(params);
});

module.exports = prisma;
