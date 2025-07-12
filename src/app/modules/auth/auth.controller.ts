 




 
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes" 
import { AuthServices } from "./auth.service"
import { catchAsync } from "../../utlis/catchAsync"
import { sentResponse } from "../../utlis/sentResponse"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})

export const AuthControllers = {
    credentialsLogin
}