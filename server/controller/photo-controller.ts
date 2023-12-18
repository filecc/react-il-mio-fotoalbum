import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PhotoClass } from "../lib/PhotoClass";
import CustomError from "../lib/CustomErrorClass";
import { Result, validationResult } from "express-validator";
import * as fs from 'fs'
import * as path from 'path'
import { prisma } from "../server";

export async function index(req: Request, res: Response, next: NextFunction) {
  const photos = await prisma.photo.findMany({
    where: { visible: true, available: true },
    include: {
      categories: {
        select: { name: true },
      },
      author: {
        select: { name: true, email: true, id: true },
      },
      likes: {
        select: { userId: true, photoId: true}
      }
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
      categories: photo.categories.map((category) => category.name.toLowerCase().trim()),
      author: photo.author,
      link: photo.link,
      likes: photo.likes.map((like) => like.userId)
    };
  });
  res.json({
    message: "Photos found successfully.",
    status: 200,
    error: false,
    photos: mappedPhotos,
  });
}
export async function indexPerAuthor(req: Request, res: Response, next: NextFunction){
    const user_id = req.cookies['user-id']
    const photos = await prisma.photo.findMany({
        where: { authorId: user_id },
        include: {
            categories: {
                select: { name: true }
            },
            author: {
              select: { name: true, email: true, id: true}
            },
            likes: {
              select: { userId: true, photoId: true}
            }
        },
        orderBy: { created_at: "desc" }
    })
    if(photos.length > 0){
      res.json({
        message: 'Photos found successfully.',
        status: 200,
        error: false,
        data: photos.map((photo) => {
            return {
                ...photo,
                categories: photo.categories.map((category) => category.name.toLowerCase().trim()),
                likes: photo.likes.map((like) => like.userId)
            }
        })
    })
    } else {
        next(new CustomError('No photos found.', 501))
        return
    }
    
    
}
export async function indexPerAuthorPublic(req: Request, res: Response, next: NextFunction){
    const user_id = req.params.id
    const photos = await prisma.photo.findMany({
        where: { authorId: user_id, visible: true, available: true },
        include: {
            categories: {
                select: { name: true }
            },
            author: {
              select: { name: true, email: true}
            },
            likes: {
              select: { userId: true, photoId: true}
            },
            _count: {
              select: { likes: true }
            }
        },
        orderBy: { created_at: "desc" }
    })
    if(photos.length > 0){
      res.json({
        message: 'Photos found successfully.',
        status: 200,
        error: false,
        data: photos.map((photo) => {
            return {
                ...photo,
                categories: photo.categories.map((category) => category.name.toLowerCase().trim()),
                likes: photo.likes.map((like) => like.userId)
            }
        })
    })
    } else {
        next(new CustomError('No photos found.', 501))
        return
    }
    
    
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
  const user = await prisma.user.findUnique({
    where: { id: user_id }
  })
  if(!user){
    next(new CustomError('User not found.', 501))
    return
  }

  if(!req.file){
    next(new CustomError('You must provide a file.', 500))
    return
  }
  
  const imageSlug = req.file.filename + '.jpg'
    fs.renameSync(req.file.path, path.resolve(`./public/images/${imageSlug}`))

  
  const photo = new PhotoClass(
    req.body.title,
    req.body.description,
    req.body.visible,
    req.body.categories ? req.body.categories.split(",") : ["general"],
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
              where: { name: category.toLowerCase().trim() },
              create: { name: category.toLowerCase().trim() },
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
            categories: photo.categories.map((category) => category.name.toLowerCase().trim())
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
  const photo = await prisma.photo.findFirst({
    where: { id: photo_id },
    include: {
      categories: {
        select: { name: true },
      },
      author: {
        select: { name: true, email: true, id: true },
      },
      likes: {
        select: { userId: true, photoId: true}
      },
      _count: {
        select: { likes: true }
      }
    },
  }).catch((err) => {
    next(new CustomError(err.message, 501));
    return;
  })
  if(photo){
      res.json({
        message: "Photo found successfully.",
        status: 200,
        error: false,
        data: {
          ...photo,
          categories: photo.categories.map((category) => category.name.toLowerCase().trim()),
          likes: photo.likes.map((like) => like.userId)
        }
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
  const photo = await prisma.photo.findFirst({
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
    const oldPhoto = await prisma.photo.findFirst({ where: { id }, include: { categories: true}})
    if(!oldPhoto){
        next(new CustomError('Photo not found.', 501))
        return
    }
    const photo = new PhotoClass(title, description, visible, categories ? categories.split(',') : ["general"], oldPhoto.link)
   
    let isEditable = true
    
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
    }).catch((err) => {
        isEditable = false
        next(new CustomError(err.message, 501))
        return
    })
    
    
    if(newPhoto && isEditable){
        if(req.file && req.file?.size > 0){
            fs.unlinkSync(path.resolve(`./public/images/${oldPhoto.link}`))
            const imageSlug = req.file.filename + '.jpg'
              fs.renameSync(req.file.path, path.resolve(`./public/images/${imageSlug}`))
              await prisma.photo.update({
                where: { id: oldPhoto.id},
                data: {
                  link: imageSlug
                }
              })
              photo.link = imageSlug
            
        }  

        res.json({
            message: 'Photo edited successfully.', 
            status: 200, 
            error: false, 
            data: {...newPhoto, categories: newPhoto.categories.map((category) => category.name)}}) 
    }
    
}
export async function handleLike(req: Request, res: Response, next: NextFunction){
  const result: Result = validationResult(req)
  if(!result.isEmpty()){
    next(new CustomError('There are some errors. Check out them.', 500, result.array()))
    return
  }
  const { id } = req.params
  const user_id = req.cookies['user-id']
  const photo = await prisma.photo.findFirst(
    { where: { id },
      include: {
        likes: {
          select: { userId: true}
        }
      }
  })
  if(!photo){
    next(new CustomError('Photo not found.', 501))
    return
  }
  const likes = photo.likes.map((like) => like.userId)
  if(!likes.includes(user_id)){
    const like = await prisma.like.create({
      data: {
        userId: user_id,
        photoId: id
      }
    })
    res.json({
      message: 'Photo liked successfully.',
      status: 200,
      error: false,
      data: like
    })
    return
  }
  
  const like = await prisma.like.deleteMany({
    where: { userId: user_id, photoId: photo.id}
  })
  res.json({
    message: 'Photo disliked successfully.',
    status: 200,
    error: false,
    data: like
  })
}
export async function feed(req: Request, res: Response, next: NextFunction) {
  const photos = await prisma.photo.findMany({
    where: { visible: true, available: true },
    include: {
      categories: {
        select: { name: true },
      },
      author: {
        select: { name: true, email: true, id: true },
      },
      likes: {
        select: { userId: true, photoId: true}
      }
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
      categories: photo.categories.map((category) => category.name.toLowerCase().trim()),
      author: photo.author,
      link: photo.link,
      likes: photo.likes.map((like) => like.userId)
    };
  });


  res.json({
    message: "Photos found successfully.",
    status: 200,
    error: false,
    photos: mappedPhotos.slice(0, 3),
  });
}