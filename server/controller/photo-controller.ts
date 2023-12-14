import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PhotoClass } from "../lib/PhotoClass";
import { CustomError } from "../lib/CustomErrorClass";

const express = require('express');
const prisma = new PrismaClient()


export async function index(req: Request, res: Response, next: NextFunction){
    const photos = await prisma.photo.findMany({
        include: { categories: {
            select: { name: true }
        }}
    })
    const mappedPhotos = photos.map(photo => {
        return {
            id: photo.id,
            title: photo.title,
            description: photo.description,
            visible: photo.visible,
            categories: photo.categories.map(category => category.name)
        }
    })
    res.json(mappedPhotos)
}

export async function store(req: Request, res: Response, next: NextFunction){
    
    const photo = new PhotoClass(req.body.title, req.body.description, req.body.visible, req.body.categories)
    await prisma.photo.create({
        data: {
            title: photo.title,
            description: photo.description,
            visible: photo.visible,
            categories: {
                connectOrCreate: photo.categories.map((category: string) => {
                    return { where: { name: category}, create: { name: category} }
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
            }
        }
    }).then(photo => {
        return res.json({
            ...photo,
            categories: photo.categories.map(category => category.name)
        })
    })

}