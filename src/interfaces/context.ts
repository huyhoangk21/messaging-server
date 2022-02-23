import { Request, Response } from 'express';
import { User } from '../entities/user';

export interface IContext {
  req: Request;
  res: Response;
  user?: User;
}
