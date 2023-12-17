import { Request } from "express";
import { prisma } from "../server"; 

export = {
    email: {
      in: ["formData"],
      isEmail: {
          errorMessage: "Not a valid email.",
          bail: true
      },
      custom: {
        options: async (value: string) => {
          const user = await prisma.user.findUnique({
            where: { email: value },
          })
         if(user) throw new Error('E-mail already in use');
        }
      }
    },
    name: {
        in: ["formData"],
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be 3 at least characters long.",
            bail: true,
        },
        isAlphanumeric: {
            errorMessage: "Name must contain only letters and numbers.",
            bail: true
        },
    },
    password: {
      in: ["formData"],
      isLength: {
        options: { min: 5 },
        errorMessage: "Password must be 5 at least characters long.",
        bail: true,
    },
      
    },
    password_control: {
        in: ["formData"],
        custom: {
            options: async (value: string, { req }:{req: Request}) => {
            if(value !== req.body.password){
                throw new Error('Passwords don\'t match.');
            }
            }
        }
    }
  };