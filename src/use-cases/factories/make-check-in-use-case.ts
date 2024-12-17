import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gym-repository";
import { CheckInUseCase } from "../check-in";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeCheckInUseCase() {
    const repository = new PrismaCheckInsRepository();
    const gymsRepository = new PrismaGymsRepository();

    const useCase = new CheckInUseCase(repository, gymsRepository);

    return useCase;
}
