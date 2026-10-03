const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const roomNames = [
        "Conference Room A",
        "Conference Room B",
        "Meeting Room 1",
        "Meeting Room 2",
        "Board Room",
    ];

    for (const name of roomNames) {
        const existingRoom = await prisma.room.findFirst({ where: { name } });
        if (!existingRoom) {
            await prisma.room.create({ data: { name } });
        }
    }

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
