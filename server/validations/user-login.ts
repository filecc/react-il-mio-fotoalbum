import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export = {
    email: {
      in: ["body"],
      isLength: {
          options: { min: 1 },
          errorMessage: "Email missing.",
          bail: true,
      },
      isEmail: {
          errorMessage: "Not a valid email.",
          bail: true
      },
      custom: {
        options: async (value: string) => {
          const user = await prisma.user.findFirstOrThrow({
            where: { email: value },
          })
          if(!user){
            return false
          }
        }, 
        errorMessage: `User doesn't exist.`
      }
    },
    password: {
      in: ["body"],
      isString: {
        errorMessage: "Password missing.",
      }
      
    }
  };