import { prisma } from "../server"

export = {
    id: {
        in: ["params"],
        isString: {
            bail: true,
            errorMessage: "Id missing.",
        },
        custom: {
            options: async (value: string) => {
                const photo = await prisma.photo.findFirst({
                    where: { id: value },
                })
                if(!photo) throw new Error('Photo doesn\'t exist.');
            }
        }
    }
}