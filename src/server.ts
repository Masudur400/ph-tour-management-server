/* eslint-disable no-console */
import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import { envVars } from './app/config/env'
import { seedSuperAdmin } from './app/utlis/seedSuperAdmin'
import { connectRedis } from './app/config/radis.config'

let server: Server


const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log('connect to DB');
        server = app.listen(envVars.PORT, () => {
            console.log(`server is listening on port ${envVars.PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()


process.on('SIGTERM', () => {
    console.log('SIGTERM signal recieved. server shutting down....!');
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on('SIGINT', () => {
    console.log('SIGINT signal recieved. server shutting down....!');
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on('unhandledRejection', (err) => {
    console.log('unhandled rejection detected. server shutting down....!', err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on('uncaughtException', (err) => {
    console.log('uncaught exception detected. server shutting down....!', err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
}) 