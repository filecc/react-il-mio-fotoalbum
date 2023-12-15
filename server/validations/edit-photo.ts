import { PrismaClient } from "@prisma/client"
import { prisma } from "../server"
const cookieParser = require('cookie-parser')
const user_id = cookieParser.JSONCookies['user-id']

export  = {
    id: {
        in: ["params"],
        isString: {
            bail: true,
            errorMessage: "Id missing.",
        },
        custom: {
            options: async (value: string) => {
                const photo = await prisma.photo.findUniqueOrThrow({
                    where: { id: value, authorId: user_id},
                })
            },
            errorMessage: `Photo doesn't exist.`
        }
    },
    title: {
        optional: true,
        in: ["body"],
        isString: {
            errorMessage: 'Title must be provided and has to be a string.',
            bail: true
        },
        isLength: {
            options: { min: 5},
            errorMessage: 'Title must be at least 5 characters long.',
        },
        
        
    },
    description: {
        optional: true,
        in: ["body"],
        isString: {
            errorMessage: 'Description must be provided and has to be a string.',
            bail: true
        },
        isLength: {
            options: { min: 10 },
            errorMessage: 'Description must be at least 10 characters long.'
        }
    },
    visible: {
        optional: true,
        in: ["body"],
        isBoolean: {
            errorMessage: 'You must provide if this photo will be visible or not. Possibile values: true or false.',
            bail: true
        },
        toBoolean: true,
        errorMessage: 'You can specifiy 0 or false for hidden or visible photos.'
    },
    categories: {
        optional: true,
        in: ["body"]
    }
}

