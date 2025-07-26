// controllers/stats.controller.ts  

import { Request, Response } from "express";
import { catchAsync } from "../../utlis/catchAsync";
import { StatsService } from "./stats.service";
import { sentResponse } from "../../utlis/sentResponse";


const getBookingStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getBookingStats();
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking stats fetched successfully",
        data: stats,
    });
});  

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getPaymentStats();
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment stats fetched successfully",
        data: stats,
    });
});

const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getUserStats();
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getTourStats();
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour stats fetched successfully",
        data: stats,
    });
});

export const StatsController = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats,
};