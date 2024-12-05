const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function main() {
  console.log("Clearing the database...");

  await prisma.ticket.deleteMany(); // Delete tickets first due to dependencies
  await prisma.seat.deleteMany(); // Delete seats
  await prisma.match.deleteMany(); // Delete matches
  await prisma.stadium.deleteMany(); // Delete stadiums
  await prisma.user.deleteMany(); // Delete users

  console.log("Database cleared. Seeding new data...");
  // Seed Users
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        username: faker.internet.username(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthDate: faker.date.past(30, new Date("2000-01-01")),
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        City: faker.location.city(),
        Address: faker.location.streetAddress(),
        emailAddress: faker.internet.email(),
        role: faker.helpers.arrayElement(["Fan", "Manager", "Admin"]),
      },
    });
  }

  // Seed Stadiums
  for (let i = 0; i < 5; i++) {
    await prisma.stadium.create({
      data: {
        vipRows: faker.number.int({ min: 2, max: 5 }),
        vipSeatsPerRow: faker.number.int({ min: 5, max: 15 }),
      },
    });
  }

  // Seed Matches
  const stadiums = await prisma.stadium.findMany();
  for (let i = 0; i < 10; i++) {
    const stadium = faker.helpers.arrayElement(stadiums);
    await prisma.match.create({
      data: {
        HomeTeam: faker.company.name(),
        AwayTeam: faker.company.name(),
        date_time: faker.date.future(),
        Refree: faker.person.fullName(),
        linesman1: faker.person.fullName(),
        linesman2: faker.person.fullName(),
        stadiumId: stadium.id,
      },
    });
  }

  // Seed Seats
  const allStadiums = await prisma.stadium.findMany();
  for (const stadium of allStadiums) {
    for (let row = 1; row <= stadium.vipRows; row++) {
      for (let seat = 1; seat <= stadium.vipSeatsPerRow; seat++) {
        await prisma.seat.create({
          data: {
            rowNumber: row,
            seatNumber: seat,
            stadiumid: stadium.id,
          },
        });
      }
    }
  }

  // Seed Tickets
  const matches = await prisma.match.findMany();
  const seats = await prisma.seat.findMany({ take: 50 }); // Only use the first 50 seats for simplicity
  const users = await prisma.user.findMany();
  for (let i = 0; i < 20; i++) {
    const match = faker.helpers.arrayElement(matches);
    const seat = faker.helpers.arrayElement(seats);
    const user = faker.helpers.arrayElement(users);
    // Check if the ticket already exists for the given match and seat
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

    await prisma.ticket.create({
      data: {
        reservedAt: faker.date.recent(),
        matchid: match.id,
        seatid: seat.id,
        userid: user.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
