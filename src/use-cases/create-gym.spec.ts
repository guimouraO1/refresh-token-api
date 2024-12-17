import { describe } from "node:test";
import { beforeEach, expect, it } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { CreateGymUseCase } from "./create-gym";

interface CreateGymRequest {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

let gymRepository: InMemoryGymRepository;
let sut: CreateGymUseCase;
let testUser: CreateGymRequest;

describe("Gym use case", () => {
    beforeEach(() => {
        gymRepository = new InMemoryGymRepository();
        sut = new CreateGymUseCase(gymRepository);

        testUser = {
            title: "JavaScript Gym",
            latitude: -22.7568428,
            longitude: -47.0170228,
            description: "",
            phone: ""
        };
    });

    it("should be able to create gym", async () => {
        const { gym } = await sut.execute(testUser);

        expect(gym.id).toEqual(expect.any(String));
    });
});
