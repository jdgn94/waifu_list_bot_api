import jwt from "jsonwebtoken";

interface Payload {
  id: number;
  telegramId: number;
}

const createToken = (body: Payload) => {
  return jwt.sign(body, process.env.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

const decodeToken = (token: string) => {
  return jwt.decode(token) as Payload;
};

export { createToken, verifyToken, decodeToken };
