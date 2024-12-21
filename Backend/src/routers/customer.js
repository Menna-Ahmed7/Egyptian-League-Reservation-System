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
    response.status(400).send({ error: error.message });
  }
});

router.post("/reserveSeat", auth, async (request, response) => {
  // console.log(request.body);
  // body: match id, seat id, pin number, credit card number
  try {
    console.log(request.user.role);

    // Define required fields for the match
    const requiredFields = ["matchId", "rowNumber", "seatNumber"];
    for (const field of requiredFields) {
      if (!(field in request.body)) {
        return response
          .status(400)
          .send({ error: `Missing required field: ${field}` });
      }
    }

    const { matchId, rowNumber, seatNumber } = request.body;
    console.log(matchId, rowNumber, seatNumber);
    // Validate the match exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return response.status(404).send({ error: "Match not found" });
    }

    // Validate the seat exists in the stadium for the match
    const seat = await prisma.seat.findFirst({
      where: {
        rowNumber,
        seatNumber,
        stadiumid: match.stadiumId, // Ensure the seat belongs to the match's stadium
      },
    });

    if (!seat) {
      return response
        .status(404)
        .send({ error: "Seat not found in the stadium" });
    }

    // Check if the seat is already reserved for the given match
    const existingTicket = await prisma.ticket.findUnique({
      where: {
        seatid_matchid: {
          seatid: seat.id,
          matchid: matchId,
        },
      },
    });

    if (existingTicket) {
      return response.status(400).send({ error: "Seat is already reserved" });
    }

    // Reserve the seat by creating a ticket
    const ticket = await prisma.ticket.create({
      data: {
        reservedAt: new Date(), // Set the reservation timestamp
        matchid: matchId,
        seatid: seat.id,
        userid: request.user.id, // Associate the reservation with the authenticated user
      },
    });

    // Return the reservation details
    response.status(201).send({
      message: "Seat reserved successfully",
      ticket,
    });
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });
  }
});

router.delete(
  "/cancelReservation/:ticketId",
  auth,
  async (request, response) => {
    try {
      const ticketId = request.params.ticketId;

      // Find the ticket and include match details
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(ticketId) },
        include: {
          match: {
            select: {
              date_time: true, // Fetch the match date-time
            },
          },
        },
      });

      if (!ticket) {
        return response.status(404).send({ error: "Ticket not found" });
      }

      // Check if the ticket belongs to the authenticated user
      if (ticket.userid !== request.user.id) {
        return response
          .status(403)
          .send({ error: "You are not authorized to cancel this ticket" });
      }

      // Check if the event is less than 3 days away
      const eventDate = new Date(ticket.match.date_time);
      const currentDate = new Date();
      const daysUntilEvent = Math.floor(
        (eventDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilEvent < 3) {
        return response
          .status(400)
          .send({
            error: "You can only cancel tickets up to 3 days before the event",
          });
      }

      // Delete the ticket (vacate the seat)
      await prisma.ticket.delete({
        where: { id: ticket.id },
      });

      response.send({
        message: "Reservation cancelled and seat is now vacant",
      });
    } catch (error) {
      console.error("Error cancelling reservation:", error.message);
      response.status(500).send({
        error: "An error occurred while cancelling the reservation",
        errorMessage: error.message,
      });
    }
  }
);

module.exports = router;
