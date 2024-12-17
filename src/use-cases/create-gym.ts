import { Gym } from "@prisma/client";
import { GymRepository } from "@/repositories/gym-repository";

interface CreateGymUseCaseRequest {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

interface CreateGymUseCaseResponse {
    gym: Gym;
}

export class CreateGymUseCase {
    constructor(private gymRepository: GymRepository) {}

    async execute({
        title,
        description,
        phone,
        latitude,
        longitude
    }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
        const gym = await this.gymRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude
        });

        return { gym };
    }
}
