const { generateAuthToken, auth } = require("../middleware/auth");
const express = require("express");
const prisma = require("../middleware/prisma");
const router = new express.Router();
const validator = require("validator");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
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
 *     Ticket:
 *       type: object
 *       properties:
 *         match:
 *           type: object
 *           properties:
 *             HomeTeam:
 *               type: string
 *             AwayTeam:
 *               type: string
 *             date_time:
 *               type: string
 *             stadium:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *         seat:
 *           type: object
 *           properties:
 *             rowNumber:
 *               type: integer
 *             seatNumber:
 *               type: integer
 */

/**
 * @swagger
 * /getUserInfo:
 *   get:
 *     summary: Get user information
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User information fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
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
/**
 * @swagger
 * /editProfile:
 *   patch:
 *     summary: Edit user profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               City:
 *                 type: string
 *               Address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid update data
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /reserveSeat:
 *   post:
 *     summary: Reserve a seat for a match
 *     tags: [Reservation]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matchId:
 *                 type: string
 *               rowNumber:
 *                 type: integer
 *               seatNumber:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Seat reserved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Missing or invalid field
 *       404:
 *         description: Match or seat not found
 *       409:
 *         description: Seat already reserved
 *       401:
 *         description: Unauthorized
 */
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
/**
 * @swagger
 * /cancelReservation/{ticketId}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         description: The ID of the ticket to cancel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *       400:
 *         description: Invalid cancellation request (ticket within 3 days of match)
 *       404:
 *         description: Ticket not found
 *       403:
 *         description: Unauthorized to cancel the ticket
 *       500:
 *         description: Internal server error
 *       401:
 *         description: Unauthorized
 */
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
