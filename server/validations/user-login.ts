import { prisma } from "../server";

export = {
    email: {
      in: ["body"],
      isEmail: {
        errorMessage: "Not a valid email.",
        bail: true
    },
      isLength: {
          options: { min: 1 },
          errorMessage: "Email missing.",
          bail: true,
      },
      custom: {
        options: async (value: string) => {
          const user = await prisma.user.findUniqueOrThrow({
            where: { email: value },
          })
          if(!user) throw new Error('User doesn\'t exist.');
        }
      }
    },
    password: {
      in: ["body"],
      isString: {
        errorMessage: "Password missing.",
      }
      
    }
  };