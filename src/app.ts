import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { usersRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInRoutes } from "./http/controllers/checkIns/routes";
import fastifyCookie from "@fastify/cookie";
import cors from '@fastify/cors'

export const app = fastify();

app.register(fastifyJwt, {
    secret: {
        public: env.JWT_PUBLIC_KEY,
        private: env.JWT_PRIVATE_KEY
    },
    cookie: {
        cookieName: "refreshToken",
        signed: false
    },
    sign: { algorithm: "RS256" , expiresIn: "10s"}
});

app.register(fastifyCookie);

app.register(cors, {
    origin: true,
    credentials: true
    }
);

app.register(usersRoutes);
// app.register(gymsRoutes);
// app.register(checkInRoutes);

app.setErrorHandler((error, _request, reply) => {
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
