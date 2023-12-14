import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export = {
    id: {
        in: ["params"],
        isString: {
            bail: true,
            errorMessage: "Id missing.",
        },
        custom: {
            options: async (value: string) => {
                const photo = await prisma.photo.findUniqueOrThrow({
                    where: { id: value },
                })
            },
            errorMessage: `Photo doesn't exist.`
        }
    }
}