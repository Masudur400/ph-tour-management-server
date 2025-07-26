import { NextFunction, Request, Response } from "express"; 



type AsyncHandler = (req: Request, res: Response, next:NextFunction) => Promise<void>
 export const catchAsync = (fn : AsyncHandler)  => async (req: Request, res: Response, next:NextFunction) =>{
    Promise.resolve(fn(req, res, next)).catch((err)=>{
        next(err)
    })
} 


// import { Request, Response, NextFunction } from 'express';

// type AsyncHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => Promise<void>;

// export const catchAsync = (fn: AsyncHandler) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };
