import { NextFunction, Request, Response } from "express"
import AppError from "../errorHeapers/appError"
import { verifyToken } from "../utlis/jwt"
import { envVars } from "../config/env"
import { JwtPayload } from "jsonwebtoken"





export const checkAuth = (...AuthRoutes: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(403, 'no access token')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload


        if (!AuthRoutes.includes(verifiedToken.role)) {
            throw new AppError(403, 'you are not permitted to view this route')
        }
        req.user = verifiedToken
        next()


    } catch (error) {
        next(error);
    }
}