import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";



export const router = Router()

const moduleRouters =[
    {
        path:'/user',
        route:userRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    }
]


moduleRouters.forEach((route)=>{
    router.use(route.path, route.route)
})