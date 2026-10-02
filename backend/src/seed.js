const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    await prisma.room.createMany({
        data: [
            { name: "Conference Room A" },
            { name: "Conference Room B" },
            { name: "Meeting Room 1" },
            { name: "Meeting Room 2" },
            { name: "Board Room" },
        ],
    });

    console.log("Rooms seeded successfully");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });