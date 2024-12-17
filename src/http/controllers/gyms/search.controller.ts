import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeSearchGymUseCase } from "@/use-cases/factories/make-search-gyms";

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1)
    });

    const { query, page } = searchGymsQuerySchema.parse(request.query);

    const makeSearchUseCase = makeSearchGymUseCase();

    const { gyms } = await makeSearchUseCase.execute({
        query,
        page
    });

    reply.status(200).send({ gyms });
}
