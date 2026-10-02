const prisma = require("../lib/prisma");

const getRooms = async(req, res, next) => {
    try{
        const rooms = await prisma.room.findMany({
            orderBy: {
                id: "asc"
            }
        })

        return res.status(200).json({
            success: true,
            data: rooms,
        })
    }catch(error) {
        next(error)
    }
}

module.exports= {
    getRooms,
}