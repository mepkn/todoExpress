import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  status?: number;
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
  let error: CustomError = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export default notFound;
