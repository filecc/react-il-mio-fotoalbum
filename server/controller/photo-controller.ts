import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PhotoClass } from "../lib/PhotoClass";
import CustomError from "../lib/CustomErrorClass";
import { Result, validationResult } from "express-validator";
const prisma = new PrismaClient()


export async function index(req: Request, res: Response, next: NextFunction){

    const photos = await prisma.photo.findMany({
        include: { 
            categories: {
                select: { name: true }
             },
            author: {
                select: { name: true, email: true, id: true}
            }
    },
        orderBy: { created_at: 'desc'}
    })
    if (!photos || photos.length === 0) {
        next(new CustomError('No photos found.', 501))
        return
    }
    const mappedPhotos = photos.map(photo => {
        return {
            id: photo.id,
            title: photo.title,
            description: photo.description,
            visible: photo.visible,
            created_at: photo.created_at,
            categories: photo.categories.map(category => category.name),
            author: photo.author
        }
    })
    res.json(mappedPhotos)
}

export async function store(req: Request, res: Response, next: NextFunction){
    const validations : Result = validationResult(req);
    if (!validations.isEmpty()) {
        next(new CustomError('There are some errors. Check out them.', 500, validations.array()))
        return
      }

    const photo = new PhotoClass(req.body.title, req.body.description, req.body.visible, req.body.categories)

    await prisma.photo.create({
        data: {
            author: {
                connect: {
                    id: '162d20b6-9a7e-11ee-8050-30d28b42ab91'
                }
            },
            title: photo.title,
            description: photo.description,
            visible: photo.visible,
            categories: {
                connectOrCreate: photo.categories.map((category: string) => {
                    return { 
                        where: { name: category}, 
                        create: { name: category} }
                })
            }
        },
        select: {
            id: true,
            title: true,
            description: true,
            visible: true,
            categories: {
                select: { name: true }
            },
            author: {
                select: { name: true, email: true, id: true}
            }
        }
    })
    .then(photo => {
        return res.json({
            ...photo,
            categories: photo.categories.map(category => category.name)
        })
    }).catch(err => {
        next(new CustomError(err.message, 501))
        return
    })

}