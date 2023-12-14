import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string) {
    const saltRounds = 5;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

export async function comparePassword(password: string, hashedPassword: string) {
  
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }

export async function generateJwtToken(payload: object){
  const token = jwt.sign(payload, process?.env?.JWT_SECRET as string, { expiresIn: '1h' })
  return token
}