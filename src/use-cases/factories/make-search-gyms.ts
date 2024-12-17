import { SearchGymsUseCase } from "../search-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gym-repository";

export function makeSearchGymUseCase() {
    const repository = new PrismaGymsRepository();
    const useCase = new SearchGymsUseCase(repository);

    return useCase;
}
