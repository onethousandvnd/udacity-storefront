import jwt, { Secret } from 'jsonwebtoken';
import { UserShoppingModel } from '../models/user-shopping';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as Secret;

export const getTokenByUser = (user: UserShoppingModel) => {
  return jwt.sign(user, SECRET_KEY);
};

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization || req.headers.authorization === '') {
    res.status(401).json({ error: 'Access denied, invalid token!' });
    return;
  }
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token!');
    return;
  }
};
