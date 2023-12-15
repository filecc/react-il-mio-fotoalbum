import { Request } from "express";
import { prisma } from "../server"; 

export = {
    email: {
      in: ["body"],
      isString: {
          errorMessage: "Email is required.",
          bail: true,   
      },
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
        in: ["body"],
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
      in: ["body"],
      isString: {
        errorMessage: "Password is required.",
      }
      
    },
    password_control: {
        in: ["body"],
        isString: {
            errorMessage: "Type again your password.",
        },
        custom: {
            options: async (value: string, { req }:{req: Request}) => {
            if(value !== req.body.password){
                throw new Error('Passwords don\'t match.');
            }
            }
        }
    }
  };