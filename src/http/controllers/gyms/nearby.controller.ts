import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchNearbyGymUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 180;
        })
    });

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

    const makeNearbyUseCase = makeFetchNearbyGymUseCase();

    const { gyms } = await makeNearbyUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude
    });

    reply.status(200).send({ gyms });
}
