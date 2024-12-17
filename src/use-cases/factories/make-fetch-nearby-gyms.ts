import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gym-repository";

export function makeFetchNearbyGymUseCase() {
    const repository = new PrismaGymsRepository();
    const useCase = new FetchNearbyGymsUseCase(repository);

    return useCase;
}
