import { Router } from "express";
import { AuthRouter } from "../module/authentication/auth.rought";

const router = Router()

const moduleRought = [
    {
        path: '/auth',
        route: AuthRouter
    },
]

moduleRought.forEach((route) => router.use(route.path, route.route))

export const Routers = router