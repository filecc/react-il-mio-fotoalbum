import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PhotoClass } from "../lib/PhotoClass";
import CustomError from "../lib/CustomErrorClass";
import { Result, validationResult } from "express-validator";
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient();

export async function index(req: Request, res: Response, next: NextFunction) {
  const photos = await prisma.photo.findMany({
    include: {
      categories: {
        select: { name: true },
      },
      author: {
        select: { name: true, email: true, id: true },
      },
    },
    orderBy: { created_at: "desc" },
  });
  if (!photos || photos.length === 0) {
    next(new CustomError("No photos found.", 501));
    return;
  }
  const mappedPhotos = photos.map((photo) => {
    return {
      id: photo.id,
      title: photo.title,
      description: photo.description,
      visible: photo.visible,
      created_at: photo.created_at,
      categories: photo.categories.map((category) => category.name),
      author: photo.author,
    };
  });
  res.json({
    message: "Photos found successfully.",
    status: 200,
    error: false,
    photos: mappedPhotos,
  });
}

export async function store(req: Request, res: Response, next: NextFunction) {
  const validations: Result = validationResult(req);
  if (!validations.isEmpty()) {
    next(
      new CustomError(
        "There are some errors. Check out them.",
        500,
        validations.array()
      )
    );
    return;
  }
  if(!req.file){
    next(new CustomError('You must provide a file.', 500))
    return
  }
  
  const imageSlug = req.file.filename + '.jpg'
    fs.renameSync(req.file.path, path.resolve(`./public/images/${imageSlug}`))



  const user_id = req.cookies["user-id"];
  const photo = new PhotoClass(
    req.body.title,
    req.body.description,
    req.body.visible,
    req.body.categories,
    imageSlug
  );
  await prisma.photo
    .create({
      data: {
        author: {
          connect: {
            id: user_id,
          },
        },
        title: photo.title,
        description: photo.description,
        visible: photo.visible,
        link: photo.link,
        categories: {
          connectOrCreate: photo.categories.map((category: string) => {
            return {
              where: { name: category },
              create: { name: category },
            };
          }),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        visible: true,
        link: true,
        categories: {
          select: { name: true },
        },
        author: {
          select: { name: true, email: true, id: true },
        },
      },
    })
    .then((photo) => {
      return res.json({
        message: "Photo created successfully.",
        status: 200,
        error: false,
        data: {
            ...photo,
            categories: photo.categories.map((category) => category.name)
        }
       
        
      });
    })
    .catch((err) => {
      next(new CustomError(err.message, 501));
      return;
    });
}

export async function show(req: Request, res: Response, next: NextFunction) {
  const result: Result = validationResult(req);
  if (!result.isEmpty()) {
    next(
      new CustomError(
        "There are some errors. Check out them.",
        500,
        result.array()
      )
    );
    return;
  }
  const photo_id = req.params.id;
  const photo = await prisma.photo.findUniqueOrThrow({
    where: { id: photo_id },
    include: {
      categories: {
        select: { name: true },
      },
      author: {
        select: { name: true, email: true, id: true },
      }
    },
  }).catch((err) => {
    next(new CustomError(err.message, 501));
    return;
  })
  if(photo){
    const photoToSend = new PhotoClass(
        photo.title, 
        photo.description, 
        photo.visible, 
        photo.categories.map((category) => category.name), 
        photo.link,
        photo.author)
    
      res.json({
        message: "Photo found successfully.",
        status: 200,
        error: false,
        data: photoToSend,
      })
  }
  
}

export async function deletePhoto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result: Result = validationResult(req);

  if (!result.isEmpty()) {
    next(
      new CustomError(
        "There are some errors. Check out them.",
        500,
        result.array()
      )
    );
    return;
  }

  const photo_id = req.params.id;
  const user_id = req.cookies["user-id"];
  const photo = await prisma.photo.findUniqueOrThrow({
    where: { id: photo_id, authorId: user_id },
    select: { link: true }
  }).catch((err) => {
    next(new CustomError(err.message, 501));
    return;
  })
  if(photo){
    fs.unlinkSync(path.resolve(`./public/images/${photo.link}`))
  }

  await prisma.photo
    .delete({
      where: { id: photo_id },
    })
    .catch((err) => {
      next(new CustomError(err.message, 501));
      return;
    });
    
  res.json({
    message: "Photo deleted successfully.",
    status: 200,
    error: false,
  });
}

export async function edit(req: Request, res: Response, next: NextFunction){
    const result : Result = validationResult(req)
    if(!result.isEmpty()){
        next(new CustomError('There are some errors. Check out them.', 500, result.array()))
        return
    }
    const { title, description, visible, categories } = req.body
    if(Object.keys(req.body).length === 0 && !req.file){
        next(new CustomError('You must provide at least one field to edit.', 500))
        return
    }
    const { id } = req.params
    const user_id = req.cookies['user-id']
    const oldPhoto = await prisma.photo.findUniqueOrThrow({ where: { id }, include: { categories: true}})
    const photo = new PhotoClass(title, description, visible, categories ?? ["general"], oldPhoto.link)

    if(req.file){
        fs.unlinkSync(path.resolve(`./public/images/${oldPhoto.link}`))
        const imageSlug = req.file.filename + '.jpg'
        fs.renameSync(req.file.path, path.resolve(`./public/images/${imageSlug}`))
        photo.link = imageSlug
    }
    const newPhoto = await prisma.photo.update({
        where: { id , authorId: user_id},
        data: {
            title: photo.title ?? oldPhoto.title,
            description: photo.description ?? oldPhoto.description,
            visible: photo.visible ?? oldPhoto.visible,
            link: photo.link,
            categories: {
                disconnect: oldPhoto.categories.map((category) => {
                    return { name: category.name }
                }),
                connectOrCreate: photo.categories.map((category: string) => {
                    return {
                        where: { name: category },
                        create: { name: category }
                    }
                })
            }

        },
       include: { 
              categories: {
                select: { name: true }
              },
              author: {
                select: { name: true, email: true, id: true }
              }
       }
    })

    res.json({
        message: 'Photo edited successfully.', 
        status: 200, 
        error: false, 
        data: {...newPhoto, categories: newPhoto.categories.map((category) => category.name)}})
}
