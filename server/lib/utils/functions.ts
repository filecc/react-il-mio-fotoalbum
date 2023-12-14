import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
    const saltRounds = 5;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash)
    return hash;
  }