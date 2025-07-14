import { GoogleCallbackParameters } from './../../../../node_modules/@types/passport-google-oauth20/index.d';
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes" 
import { AuthServices } from "./auth.service"
import { catchAsync } from "../../utlis/catchAsync"
import { sentResponse } from "../../utlis/sentResponse"
import AppError from "../../errorHeapers/appError"
import { setAuthCookie } from "../../utlis/setCookie"
import { createUserToken } from '../../utlis/userTokens';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body) 
    
    setAuthCookie(res, loginInfo)

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, 'no refresh token received from cookies')
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

     setAuthCookie(res, tokenInfo)

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "new access token retrive Successfully",
        data: tokenInfo,
    })
})


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    res.clearCookie('accessToken', {
        httpOnly:true,
        secure:false,
        sameSite:"lax",
    })
    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure:false,
        sameSite:"lax",
    })

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged out Successfully",
        data: null,
    })
})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

      
     const newPassword = req.body.newPassword
     const oldPassword = req.body.oldPassword
     const decodedToken = req.user
      await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "reset password Successfully",
        data: null,
    })
})



const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

      
     const user = req.user 
     let redirectTo = req.query.state ? req.query.state as string : "" 

     if(redirectTo.startsWith("/")){
        redirectTo = redirectTo.slice(1)
     }

     if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "user not found")
     }

     const tokenInfo = createUserToken(user)

     setAuthCookie(res,tokenInfo)

    // sentResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "reset password Successfully",
    //     data: null,
    // })
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})




export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
    
}