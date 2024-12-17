import { FastifyRequest, FastifyReply } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify({ onlyCookie: true });

        const { role } = request.user;

        const token = await reply.jwtSign(
            { role },
            {
                sign: {
                    sub: request.user.sub
                }
            }
        );

        const refreshToken = await reply.jwtSign(
            { role },
            {
                sign: {
                    sub: request.user.sub,
                    expiresIn: "7d"
                }
            }
        );

        reply
            .setCookie("refreshToken", refreshToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: true
            })
            .status(200)
            .send({ token });
    } catch (error) {
        reply.status(400).send({ error })
    }

}
