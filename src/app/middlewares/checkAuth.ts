import { httpStatus } from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import AppError from "../errorHeapers/appError"
import { verifyToken } from "../utlis/jwt"
import { envVars } from "../config/env"
import { JwtPayload } from "jsonwebtoken"
import { User } from "../modules/user/user.model"
import { IsActive } from '../modules/user/user.interface';





export const checkAuth = (...AuthRoutes: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(403, 'no access token')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

         const isUserExist = await User.findOne({ email : verifiedToken.email})

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "user does not exist")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `user has ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "user has deleted")
    }


        if (!AuthRoutes.includes(verifiedToken.role)) {
            throw new AppError(403, 'you are not permitted to view this route')
        }
        req.user = verifiedToken
        next()


    } catch (error) {
        next(error);
    }
}