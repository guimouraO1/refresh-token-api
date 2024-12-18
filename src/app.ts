import fastify, { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { usersRoutes } from "./http/controllers/users/routes";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";

export class App {
    private app: FastifyInstance;

    constructor() {
        this.app = fastify();
        this.registerPlugins();
        this.setRoutes();
        this.setErrorHandler();
    }

    private registerPlugins(): void {
        this.app.register(fastifyJwt, {
            secret: {
                public: env.JWT_PUBLIC_KEY,
                private: env.JWT_PRIVATE_KEY
            },
            cookie: {
                cookieName: "refreshToken",
                signed: false
            },
            sign: { algorithm: "RS256", expiresIn: "10m" }
        });

        this.app.register(fastifyCookie);
        this.app.register(cors, {
            origin: true,
            credentials: true
        });
    }

    private setRoutes(): void {
        this.app.register(usersRoutes);
    }

    private setErrorHandler(): void {
        this.app.setErrorHandler((error, _request, reply) => {
            if (error instanceof ZodError) {
                return reply.status(400).send({
                    message: "Validation Error.",
                    issues: error.format()
                });
            }

            if (env.NODE_ENV !== "production") {
                console.error(error);
            }

            return reply.status(500).send({ message: "Internal Server Error" });
        });
    }

    public getServer(): FastifyInstance {
        return this.app;
    }
}

export const app = new App().getServer();
