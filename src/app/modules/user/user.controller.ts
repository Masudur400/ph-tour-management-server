
import httpStatus from 'http-status-codes';
import { userServices } from "./user.service";
import { catchAsync } from "../../utlis/catchAsync";
import { Request,Response,NextFunction,  } from 'express';
import { sentResponse } from '../../utlis/sentResponse'; 
import { JwtPayload } from 'jsonwebtoken';
import { QueryBuilder } from '../../utlis/queryBuilder';
import { User } from './user.model';
import { userSearchableFields } from './userConstant';



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
    const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload)

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




// const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const result = await userServices.getAllUsers();
//     // res.status(httpStatus.OK).json({
//     //     success: true,
//     //     message: 'all users',
//     //     data: result
//     // });
//     sentResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: 'all users',
//         data: result.data,
//         meta: result.meta
//     })
// });

const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await userServices.getMe(decodedToken.userId);

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sentResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userServices.getSingleUser(id);
    sentResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUser,
    getMe
}
