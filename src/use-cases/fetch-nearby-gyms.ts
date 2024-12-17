import { Gym } from "@prisma/client";
import { GymRepository } from "@/repositories/gym-repository";

interface FetchNearbyGymsUseCaseRequest {
    userLatitude: number;
    userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
    gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
    constructor(private gymRepository: GymRepository) {}

    async execute({
        userLatitude,
        userLongitude
    }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
        const gyms = await this.gymRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        });

        return { gyms };
    }
}
