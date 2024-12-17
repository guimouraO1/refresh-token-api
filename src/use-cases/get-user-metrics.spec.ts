import { describe } from "node:test";
import { beforeEach, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

interface GetUserMetricsUseCaseRequest {
    userId: string;
}

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;
let userRequest: GetUserMetricsUseCaseRequest;

describe("Get user metrics use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserMetricsUseCase(checkInsRepository);
    });

    it("should be able to get check-ins count fron metrics", async () => {
        await checkInsRepository.create({
            user_id: "user-01",
            gym_id: "gym-01"
        });

        await checkInsRepository.create({
            user_id: "user-01",
            gym_id: "gym-02"
        });

        userRequest = {
            userId: "user-01"
        };

        const { checkInsCount } = await sut.execute(userRequest);

        expect(checkInsCount).toEqual(2);
    });
});
