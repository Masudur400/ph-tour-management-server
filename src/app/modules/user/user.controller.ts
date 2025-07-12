
import httpStatus from 'http-status-codes';
import { userServices } from "./user.service";
import { catchAsync } from "../../utlis/catchAsync";
import { Request,Response,NextFunction,  } from 'express';
import { sentResponse } from '../../utlis/sentResponse';
import { verifyToken } from '../../utlis/jwt';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);
    // res.status(httpStatus.CREATED).json({
    //     message: 'user created successfully',
    //     user
    // });
    sentResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'user created successfully',
        data: user,

    }) 
});




const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await userServices.updateUser(userId, payload, verifiedToken)

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})




const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: 'all users',
    //     data: result
    // });
    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'all users',
        data: result.data,
        meta: result.meta
    })
});

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}
