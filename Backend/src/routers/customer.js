const { generateAuthToken, auth } = require("../middleware/auth");
const express = require("express");
const prisma = require("../middleware/prisma");
const router = new express.Router();
const validator = require("validator");

router.get("/getUserInfo", auth, async (request, response) => {
  // console.log(request.body);
  try {
    console.log(request.user.id);
    const user = await prisma.user.findUnique({
      where: {
        id: request.user.id,
      },
      include: {
        tickets: {
          include: {
            match: {
              select: {
                HomeTeam: true,
                AwayTeam: true,
                date_time: true,
                stadium: {
                  select: {
                    name: true, // Include the stadium name
                  },
                },
              },
            },
            seat: {
              select: {
                rowNumber: true,
                seatNumber: true,
              },
            },
          },
        },
      },
    });

    const { password, tokens, ...safeUser } = user; // Destructure to exclude sensitive fields

    response.send(safeUser);
    // console.log("User created successfully:", user);
  } catch (error) {
    if (Object.keys(error).length === 0)
      response.status(400).send({ error: error });
    else response.status(400).send({ error: error.message });
    console.log(error);
  }
});
router.patch("/editProfile", auth, async (request, response) => {
  // console.log(request.body);
  try {
    // check for valid updates
    const updates = Object.keys(request.body);
    const allowedUpdates = [
      "password",
      "firstName",
      "lastName",
      "birthDate",
      "gender",
      "City",
      "Address",
    ];
    const isValidOperation = updates.every((update) => {
      // to access each element in updates array
      // this function returns true only if for every element it is true
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation)
      return response
        .status(400)
        .send({ error: "Invalid Updates!, You can't edit username or email" });

    const updateData = { ...request.body };
    if (request.body.birthDate)
      updateData.birthDate = new Date(request.body.birthDate);

    const updatedProfile = await prisma.user.update({
      where: { id: request.user.id },
      data: updateData,
    });
    const { password, tokens, ...safeUser } = updatedProfile; // Destructure to exclude sensitive fields
    response.status(201).send(safeUser);
    // console.log("User created successfully:", user);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });
  }
});

module.exports = router;
