const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();
require("dotenv").config();
async function main() {
  console.log("Database URL:", process.env.DATABASE_URL);

  console.log("Clearing the database...");

  // await prisma.ticket.deleteMany(); // Delete tickets first due to dependencies
  // await prisma.seat.deleteMany(); // Delete seats
  // await prisma.match.deleteMany(); // Delete matches
  // await prisma.stadium.deleteMany(); // Delete stadiums
  // await prisma.user.deleteMany(); // Delete users

  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthDate: faker.date.past(30, new Date("2000-01-01")),
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        City: faker.location.city(),
        Address: faker.location.streetAddress(),
        emailAddress: faker.internet.email(),
        role: faker.helpers.arrayElement(["Fan", "Manager", "Admin"]),
        tokens: [],
      },
    });
    users.push(user);
  }
  console.log(`Seeded ${users.length} users`);

  // Seed Stadiums
  const stadiums = [];
  for (let i = 0; i < 5; i++) {
    const stadium = await prisma.stadium.create({
      data: {
        name: faker.company.name() + " Stadium",
        vipRows: faker.number.int({ min: 2, max: 5 }),
        vipSeatsPerRow: faker.number.int({ min: 5, max: 15 }),
      },
    });
    stadiums.push(stadium);
  }
  console.log(`Seeded ${stadiums.length} stadiums`);

  // Seed Matches
  const matches = [];
  for (let i = 0; i < 10; i++) {
    const stadium = faker.helpers.arrayElement(stadiums);
    const match = await prisma.match.create({
      data: {
        HomeTeam: faker.company.name() + " Team",
        AwayTeam: faker.company.name() + " Team",
        date_time: faker.date.future(),
        Refree: faker.person.fullName(),
        linesman1: faker.person.fullName(),
        linesman2: faker.person.fullName(),
        stadiumId: stadium.id,
      },
    });
    matches.push(match);
  }
  console.log(`Seeded ${matches.length} matches`);

  // Seed Seats for Each Stadium
  const seats = [];
  for (const stadium of stadiums) {
    for (let row = 1; row <= stadium.vipRows; row++) {
      for (let seat = 1; seat <= stadium.vipSeatsPerRow; seat++) {
        const createdSeat = await prisma.seat.create({
          data: {
            rowNumber: row,
            seatNumber: seat,
            stadiumid: stadium.id,
          },
        });
        seats.push(createdSeat);
      }
    }
  }
  console.log(`Seeded ${seats.length} seats`);

  // Seed Tickets
  const tickets = [];
  const limitedSeats = seats.slice(0, 50); // Limit to first 50 seats for simplicity
  for (let i = 0; i < 20; i++) {
    const match = faker.helpers.arrayElement(matches);
    const seat = faker.helpers.arrayElement(limitedSeats);
    const user = faker.helpers.arrayElement(users);

    // Check for existing ticket with the same seat and match
    const existingTicket = await prisma.ticket.findUnique({
      where: {
        seatid_matchid: {
          seatid: seat.id,
          matchid: match.id,
        },
      },
    });

    if (existingTicket) continue; // Skip this iteration if the ticket already exists

    const ticket = await prisma.ticket.create({
      data: {
        reservedAt: faker.date.recent(),
        matchid: match.id,
        seatid: seat.id,
        userid: user.id,
      },
    });
    tickets.push(ticket);
  }
  console.log(`Seeded ${tickets.length} tickets`);

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
