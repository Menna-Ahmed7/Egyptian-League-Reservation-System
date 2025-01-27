const { generateAuthToken, auth } = require("../middleware/auth");
const express = require("express");
const prisma = require("../middleware/prisma");
const router = new express.Router();
const validator = require("validator");
/**
 * @swagger
 * components:
 *   schemas:
 *     Stadium:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         vipRows:
 *           type: integer
 *         vipSeatsPerRow:
 *           type: integer
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         HomeTeam:
 *           type: string
 *         AwayTeam:
 *           type: string
 *         date_time:
 *           type: string
 *           format: date-time
 *         Refree:
 *           type: string
 *         linesman1:
 *           type: string
 *         linesman2:
 *           type: string
 *         stadiumId:
 *           type: integer
 *         stadiumName:
 *           type: string
 *     Seat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rowNumber:
 *           type: integer
 *         seatNumber:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [reserved, vacant]
 */
/**
 * @swagger
 * /addStadium:
 *   post:
 *     summary: Add a new stadium
 *     description: Only accessible by Managers, creates a new stadium with the provided details.
 *     tags: [Stadium]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the stadium
 *               vipRows:
 *                 type: integer
 *                 description: The number of VIP rows in the stadium
 *               vipSeatsPerRow:
 *                 type: integer
 *                 description: The number of seats per VIP row
 *     responses:
 *       201:
 *         description: Stadium created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stadium'
 *       400:
 *         description: Bad request, missing required fields or invalid data
 *       404:
 *         description: Unauthorized access or resource not found
 */

/**
 * @swagger
 * /getStadiums:
 *   get:
 *     summary: Retrieve all stadiums
 *     description: Get a list of all stadiums in the system.
 *     tags: [Stadium]
 *     responses:
 *       200:
 *         description: List of stadiums
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stadium'
 *       400:
 *         description: Error occurred while fetching stadiums
 */

/**
 * @swagger
 * /getMatches:
 *   get:
 *     summary: Retrieve all matches
 *     description: Get a list of all scheduled matches, including stadium names.
 *     tags: [Match]
 *     responses:
 *       200:
 *         description: List of matches with stadium names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       400:
 *         description: Error occurred while fetching matches
 */

/**
 * @swagger
 * /addMatch:
 *   post:
 *     summary: Add a new match
 *     description: Only accessible by Managers, creates a new match with provided details.
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HomeTeam:
 *                 type: string
 *               AwayTeam:
 *                 type: string
 *               date_time:
 *                 type: string
 *                 format: date-time
 *               stadiumName:
 *                 type: string
 *               Refree:
 *                 type: string
 *               linesman1:
 *                 type: string
 *               linesman2:
 *                 type: string
 *     responses:
 *       201:
 *         description: Match created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: Bad request, missing required fields or invalid data
 *       404:
 *         description: Stadium not found or invalid date_time
 */

/**
 * @swagger
 * /getStadiumIdByName/{name}:
 *   get:
 *     summary: Retrieve stadium by name
 *     description: Get stadium details based on the provided name.
 *     tags: [Stadium]
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: Name of the stadium to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stadium details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stadium'
 *       404:
 *         description: Stadium not found
 */

/**
 * @swagger
 * /editMatch/{id}:
 *   patch:
 *     summary: Edit match details
 *     description: Only accessible by Managers, updates match details for a specific match ID.
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Match ID to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HomeTeam:
 *                 type: string
 *               AwayTeam:
 *                 type: string
 *               date_time:
 *                 type: string
 *                 format: date-time
 *               stadiumId:
 *                 type: string
 *               Refree:
 *                 type: string
 *               linesman1:
 *                 type: string
 *               linesman2:
 *                 type: string
 *     responses:
 *       200:
 *         description: Match updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: Invalid updates or invalid data
 *       404:
 *         description: Match not found
 */

/**
 * @swagger
 * /getSeatsDetails/{id}:
 *   get:
 *     summary: Retrieve seat details for a match
 *     description: Get a list of all seats for the match with their status (vacant/reserved).
 *     tags: [Seat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Match ID to get seat details for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeatDetails'
 *       400:
 *         description: Error fetching seat details
 *       404:
 *         description: Match not found
 */

/**
 * @swagger
 * /getMatchById/{id}:
 *   get:
 *     summary: Retrieve match details by ID
 *     description: Get detailed match information for a specific match ID.
 *     tags: [Match]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Match ID to fetch details for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Stadium:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         vipRows:
 *           type: integer
 *         vipSeatsPerRow:
 *           type: integer
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         HomeTeam:
 *           type: string
 *         AwayTeam:
 *           type: string
 *         date_time:
 *           type: string
 *           format: date-time
 *         stadiumName:
 *           type: string
 *         Refree:
 *           type: string
 *         linesman1:
 *           type: string
 *         linesman2:
 *           type: string
 *     SeatDetails:
 *       type: object
 *       properties:
 *         matchId:
 *           type: string
 *         matchDetails:
 *           type: object
 *           properties:
 *             HomeTeam:
 *               type: string
 *             AwayTeam:
 *               type: string
 *             date_time:
 *               type: string
 *               format: date-time
 *         stadiumDetails:
 *           $ref: '#/components/schemas/Stadium'
 *         seatDetails:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               rowNumber:
 *                 type: integer
 *               seatNumber:
 *                 type: integer
 *               status:
 *                 type: string
 */
router.post("/addStadium", auth, async (request, response) => {
  // console.log(request.body);
  try {
    if (request.user.role !== "Manager")
      return response
        .status(404)
        .send({ error: "Only Managers can add new stadium" });
    // Define required fields
    const requiredFields = ["vipRows", "vipSeatsPerRow", "name"];

    // Check if all required fields are present in the request body
    for (const field of requiredFields) {
      if (!(field in request.body)) {
        return response
          .status(400)
          .send({ error: `Missing required field: ${field}` });
      }
    }
    const { name, vipRows, vipSeatsPerRow } = request.body;

    // Check if the stadium name already exists
    const existingStadium = await prisma.stadium.findUnique({
      where: { name },
    });
    if (existingStadium) {
      return response
        .status(400)
        .send({ error: `A stadium with the name ${name} already exists` });
    }
    if (vipRows < 50)
      return response.status(400).send({ error: "Minimum of Rows is 50" });
    if (vipSeatsPerRow < 50)
      return response
        .status(400)
        .send({ error: "Minimum of Seats Per Rows is 50" });
    const stadium = await prisma.stadium.create({
      data: request.body,
    });
    // Generate seats for the stadium
    const seats = [];
    for (let row = 1; row <= vipRows; row++) {
      for (let seat = 1; seat <= vipSeatsPerRow; seat++) {
        seats.push({
          rowNumber: row,
          seatNumber: seat,
          stadiumid: stadium.id,
        });
      }
    }

    // Insert all seats into the database
    await prisma.seat.createMany({
      data: seats,
    });
    response.status(201).send(stadium);
    // console.log("User created successfully:", user);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });
  }
});

router.get("/getStadiums", async (request, response) => {
  // console.log(request.body);
  try {
    const stadiums = await prisma.stadium.findMany({});
    response.send(stadiums);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });

    console.log(error);
  }
});
router.get("/getMatches", async (request, response) => {
  // console.log(request.body);
  try {
    const matches = await prisma.match.findMany({
      include: {
        stadium: {
          select: {
            name: true, // Assuming `name` is the field in the `stadium` model
          },
        },
      },
    });
    response.send(matches);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });

    console.log(error);
  }
});

router.post("/addMatch", auth, async (request, response) => {
  // console.log(request.body);
  try {
    console.log(request.user.role);
    if (request.user.role !== "Manager")
      return response
        .status(404)
        .send({ error: "Only Managers can add new match" });
    // Define required fields

    // Define required fields for the match
    const requiredFields = [
      "HomeTeam",
      "AwayTeam",
      "date_time",
      "stadiumName",
      "Refree",
      "linesman1",
      "linesman2",
    ];
    for (const field of requiredFields) {
      if (!(field in request.body)) {
        return response
          .status(400)
          .send({ error: `Missing required field: ${field}` });
      }
    }

    // Validate the stadium ID exists in the database
    const stadium = await prisma.stadium.findUnique({
      where: {
        name: request.body.stadiumName.trim(),
      },
    });

    if (!stadium) {
      return response.status(404).send({ error: "Stadium not found" });
    }

    // Validate the date_time (it should be a valid date)
    const matchDate = new Date(request.body.date_time);
    if (validator.isDate(request.body.date_time)) {
      return response.status(400).send({ error: "Invalid date_time" });
    }
    // Check if the date_time is in the past
    const currentDate = new Date();
    if (matchDate < currentDate) {
      return response
        .status(400)
        .send({ error: "The match date cannot be in the past" });
    }

    // Ensure there is a margin of at least 3 hours between matches at the same stadium
    const marginInMilliseconds = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const existingMatches = await prisma.match.findMany({
      where: {
        stadiumId: request.body.stadiumId,
        date_time: {
          gte: new Date(matchDate - marginInMilliseconds), // Check matches within 3 hours before
          lte: new Date(matchDate + marginInMilliseconds), // Check matches within 3 hours after
        },
      },
    });

    if (existingMatches.length > 0) {
      return response.status(400).send({
        error: `A match is already scheduled at this stadium during this time. There must be at least 3 hours between matches.`,
      });
    }
    // Create the match
    const match = await prisma.match.create({
      data: {
        HomeTeam: request.body.HomeTeam,
        AwayTeam: request.body.AwayTeam,
        date_time: matchDate,
        Refree: request.body.Refree,
        linesman1: request.body.linesman1,
        linesman2: request.body.linesman2,
        stadiumId: stadium.id,
      },
      include: {
        stadium: {
          select: {
            name: true,
          },
        },
      },
    });

    // Return the created match
    response.status(201).send(match);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });
  }
});
router.get("/getStadiumIdByName/:name", async (request, response) => {
  // console.log(request.body);
  try {
    const stadium = await prisma.stadium.findUnique({
      where: { name: request.params.name.trim() },
    });
    if (!stadium) {
      return response.status(404).send({ error: "Stadium not found" });
    }
    response.send(stadium);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });

    console.log(error);
  }
});
router.patch("/editMatch/:id", auth, async (request, response) => {
  // console.log(request.body);
  try {
    if (request.user.role !== "Manager")
      return response
        .status(404)
        .send({ error: "Only Managers can edit match details" });

    // Find the match by ID to check if it exists
    const match = await prisma.match.findUnique({
      where: { id: request.params.id },
    });

    // If the match doesn't exist, return a 404 error
    if (!match) {
      return response.status(404).send({ error: "Match not found" });
    }

    // check for valid updates
    const updates = Object.keys(request.body);
    const allowedUpdates = [
      "HomeTeam",
      "AwayTeam",
      "date_time",
      "Refree",
      "linesman1",
      "linesman2",
      "stadiumId",
    ];
    const isValidOperation = updates.every((update) => {
      // to access each element in updates array
      // this function returns true only if for every element it is true
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation)
      return response.status(400).send({ error: "Invalid Updates!" });

    // Validate the date_time field if it's included in the update
    if (request.body.date_time) {
      // Validate the date_time (it should be a valid date)
      const matchDate = new Date(request.body.date_time);
      if (validator.isDate(request.body.date_time)) {
        return response.status(400).send({ error: "Invalid date_time" });
      }
      const currentDate = new Date();
      if (matchDate < currentDate) {
        return response
          .status(400)
          .send({ error: "The match date cannot be in the past" });
      }
    }

    // Check if the stadiumId exists if provided
    if (request.body.stadiumId) {
      const stadium = await prisma.stadium.findUnique({
        where: { id: request.body.stadiumId },
      });
      if (!stadium) {
        return response.status(400).send({ error: "Stadium not found" });
      }
    }
    const updatedMatch = await prisma.match.update({
      where: { id: request.params.id },
      data: request.body,
      include: {
        stadium: { select: { name: true } }, // Include stadium name in the response
      },
      //   data: request.body,
    });
    response.status(201).send(updatedMatch);
    // console.log("User created successfully:", user);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });
  }
});

router.get("/getSeatsDetails/:id", auth, async (request, response) => {
  try {
    // Check if the user is a Manager

    const matchId = request.params.id;

    // Find the match to ensure it exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return response.status(404).send({ error: "Match not found" });
    }
    // Get all seats in the stadium for the match
    const seats = await prisma.seat.findMany({
      where: {
        stadiumid: match.stadiumId,
      },
      select: {
        id: true,
        rowNumber: true,
        seatNumber: true,
      },
    });
    // Get all reserved seats (tickets) for the match
    const reservedSeats = await prisma.ticket.findMany({
      where: {
        matchid: matchId,
      },
      select: {
        seatid: true,
      },
    });
    // Create a set of reserved seat IDs for quick lookup
    const reservedSeatIds = new Set(
      reservedSeats.map((ticket) => ticket.seatid)
    );
    const vacantSeats = seats.filter((seat) => !reservedSeatIds.has(seat.id));
    let seatDetails = [];

    seatDetails = seats.map((seat) => ({
      rowNumber: seat.rowNumber,
      seatNumber: seat.seatNumber,
      status: reservedSeatIds.has(seat.id) ? "reserved" : "vacant",
    }));
    // else
    //   seatDetails = vacantSeats.map((seat) => ({
    //     rowNumber: seat.rowNumber,
    //     seatNumber: seat.seatNumber,
    //   }));
    console.log(match.stadiumId);
    const stadiumDetails = await prisma.stadium.findUnique({
      where: {
        id: match.stadiumId,
      },
    });
    // Respond with detailed seat information
    response.send({
      matchId: match.id,
      matchDetails: {
        HomeTeam: match.HomeTeam,
        AwayTeam: match.AwayTeam,
        date_time: match.date_time,
      },
      stadiumDetails,
      seatDetails,
    });
  } catch (error) {
    //   console.error("Error fetching seat details:", error.message);
    response.status(400).send({
      error: "An error occurred while fetching seat details",
      errorMessage: error.message,
    });

    //   response.status(500).send({ error: "An error occurred while fetching seat details" });
  }
});

router.get("/getMatchById/:id", async (request, response) => {
  // console.log(request.body);
  try {
    const match = await prisma.match.findUnique({
      where: { id: request.params.id.trim() },
      include: {
        stadium: {
          select: {
            name: true, // Include only the stadium name
          },
        },
      },
    });
    if (!match) {
      return response.status(404).send({ error: "Match not found" });
    }
    const stadiumDetails = await prisma.stadium.findUnique({
      where: {
        id: match.stadiumId,
      },
    });
    const { stadium, ...matchData } = match;
    const transformedResponse = {
      ...matchData,
      stadiumName: stadium?.name || null, // Rename "stadium.name" to "stadium_name"
      stadiumDetails,
    };
    response.send(transformedResponse);
  } catch (error) {
    response.status(400).send({ error: error, errorMessage: error.message });

    console.log(error);
  }
});

module.exports = router;
