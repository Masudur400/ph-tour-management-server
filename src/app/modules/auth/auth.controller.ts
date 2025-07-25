/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes" 
import { AuthServices } from "./auth.service"
import { catchAsync } from "../../utlis/catchAsync"
import { sentResponse } from "../../utlis/sentResponse"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utlis/setCookie"
import { createUserToken } from '../../utlis/userTokens';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';

// const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     // const loginInfo = await AuthServices.credentialsLogin(req.body) 
//     passport.authenticate("local", async(err: any, user: any, info: any)=>{

//         if (err) { 
//             return next(new AppError(401, err))
//         }
//          if (!user) { 
//             return next(new AppError(401, info.message))
//         }

//         const userTokens = await createUserToken(user)
//         const { password: pass, ...rest } = user.toObject()



//         setAuthCookie(res, userTokens)

//     sentResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "User Logged In Successfully",
//         data:  {
//                 accessToken: userTokens.accessToken,
//                 refreshToken: userTokens.refreshToken,
//                 user: rest

//             },
//     })

//     })(req, res, next)
    
    
// })

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) { 
            return next(new AppError(401, err))
        }

        if (!user) { 
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserToken(user)

        // delete user.toObject().password

        const { password: pass, ...rest } = user.toObject()


        setAuthCookie(res, userTokens)

        sentResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)   
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


const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

      
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


const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload
    const { password } = req.body;

    await AuthServices.setPassword(decodedToken.userId, password);

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})


const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { email } = req.body;

    await AuthServices.forgotPassword(email);

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})




export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword,
    googleCallbackController
    
}