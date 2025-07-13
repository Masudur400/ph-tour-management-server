import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes" 
import { AuthServices } from "./auth.service"
import { catchAsync } from "../../utlis/catchAsync"
import { sentResponse } from "../../utlis/sentResponse"
import AppError from "../../errorHeapers/appError"
import { setAuthCookie } from "../../utlis/setCookie"

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
      await AuthServices.resetPassword(oldPassword, newPassword, decodedToken)

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "reset password Successfully",
        data: null,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
    
}