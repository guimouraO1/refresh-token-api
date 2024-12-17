import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

interface UserRequest {
    userLatitude: number;
    userLongitude: number;
}

let gymsRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsUseCase;
let userRequest: UserRequest;

describe("Fetch Nearcy Gyms Use Case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it("should be able to fetch nearby gyms", async () => {
        await gymsRepository.create({
            title: "Near Gym",
            latitude: -22.7568428,
            longitude: -47.0170228,
            description: "",
            phone: ""
        });

        await gymsRepository.create({
            title: "Far Gym",
            latitude: -23.5288706,
            longitude: -46.6330218,
            description: "",
            phone: ""
        });

        userRequest = {
            userLatitude: -22.7568428,
            userLongitude: -47.0170228
        };

        const { gyms } = await sut.execute(userRequest);

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
    });
});
