import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PhotoClass } from "../lib/PhotoClass";
import CustomError from "../lib/CustomErrorClass";
import { Result, validationResult } from "express-validator";
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
  res.json(mappedPhotos);
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
  const user_id = req.cookies["user-id"];
  const photo = new PhotoClass(
    req.body.title,
    req.body.description,
    req.body.visible,
    req.body.categories
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
        ...photo,
        categories: photo.categories.map((category) => category.name),
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
        photo.author)
    
      res.json(photoToSend)
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
