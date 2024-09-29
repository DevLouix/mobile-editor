import { NextApiRequest } from 'next';
import { Request } from 'express';

export interface NextApiRequestWithMulter extends NextApiRequest, Request {
  file: Express.Multer.File; // Add multer file type
}
