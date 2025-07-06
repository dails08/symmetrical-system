import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { logger } from "colyseus";
import { Request, Response, NextFunction } from "express";

/**
 * Import your Room files
 */
import { SlayerRoom } from "./rooms/SlayerRoom";

const allowedOrigins = ["http://localhost:4200"];

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    logger.debug("Request:");
    logger.debug(origin);
    
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Vary", "Origin");
    }

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    next();
};

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('gameplay', SlayerRoom, );

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.use("/", (req, res) => {
            logger.info(req);
        })

        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());
        app.use("/", corsMiddleware);
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
