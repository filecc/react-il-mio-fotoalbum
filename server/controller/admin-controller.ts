import { NextFunction, Request, Response } from "express";
import { prisma } from "../server";
import CustomError from "../lib/CustomErrorClass";



export async function home(req: Request, res: Response, next: NextFunction) {

    res.json({
        message: 'Welcome to the admin page',
        code: 200,
        error: false
    })
    return
}

export async function index(req: Request, res: Response, next: NextFunction) {
    const { startIndex, maxIndex, perPage } = req.query
    const photos = await prisma.photo.findMany({
        include: {
            author: {
                select: {
                    id: true, 
                    name: true, 
                    email: true,
                    role: true
                }
            },
            categories: true
        },
        orderBy: { created_at: "desc" },
    })
    if(!photos){
        next(new CustomError('No photos found', 404))
        return
    }
    const mappedPhotos = photos.map((photo) => {
        return {
          ...photo,
          categories: photo.categories.map((category) => category.name.toLowerCase().trim()),
          author: photo.author,
          link: photo.link
        };
      });

    if(!startIndex){
        next(new CustomError('startIndex are required', 400))
        return
    }

    const start = parseInt(startIndex as string)
    const pagination = perPage ? parseInt(perPage as string) : 10
    const max = maxIndex ? parseInt(maxIndex as string) : pagination
    if(start > max){
        next(new CustomError('Start index must be less than max index', 400))
        return
    }
    if(start < 0 || max < 0){
        next(new CustomError('Start index and max index must be positive numbers', 400))
        return
    }
    if(start > photos.length){
        next(new CustomError('Start index and max index must be less than the total number of photos', 400))
        return
    }

    let index = {
        start: start,
    }
    const data = mappedPhotos.slice(index.start, max)
    const nextPage = index.start + pagination < mappedPhotos.length ? `admin/photos?startIndex=${index.start + pagination}&maxIndex=${max + pagination}&perPage=${pagination}` : null
    const previousPage = index.start - pagination >= 0 ? `admin/photos?startIndex=${index.start - pagination}&maxIndex=${max - pagination}&perPage=${pagination}` : null
     

    res.json({
        code: 200,
        message: 'Photos found',
        error: false,
        pages: Math.ceil(mappedPhotos.length / pagination),
        data,
        total: photos.length,
        nextPage,
        previousPage
    })

}

export async function changeAvailability(req: Request, res: Response, next: NextFunction){
    
    if(!req.params){
        next(new CustomError('Id is required', 400))
        return
    }
    const { id } = req.params
    const photo = await prisma.photo.findFirst({ where: { id: id }, select: { available: true } })
    if(!photo){
        next(new CustomError('Photo not found', 404))
        return
    }
    const photoUpdated = await prisma.photo.update({
        where: {id: id},
        data: {available: !photo.available}
    })
    if(!photoUpdated){
        next(new CustomError('Availability not edited', 404))
        return
    }
    res.json(
        {
            code: 200,
            message: 'Availability changed',
            error: false
        }
    )
}