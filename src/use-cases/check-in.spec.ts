import { describe } from "node:test";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

interface CheckInUserRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

let checkInsRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInUseCase;
let checkInRequest: CheckInUserRequest;

describe("Check-in use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymRepository = new InMemoryGymRepository();
        sut = new CheckInUseCase(checkInsRepository, gymRepository);

        await gymRepository.create({
            id: "gym-01",
            title: "",
            description: "",
            latitude: -22.7568428,
            longitude: -47.0170228,
            phone: "",
            created_at: new Date()
        });

        checkInRequest = {
            userId: "user-01",
            gymId: "gym-01",
            userLatitude: -22.7568428,
            userLongitude: -47.0170228
        };

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute(checkInRequest);

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

        await sut.execute(checkInRequest);

        await expect(sut.execute(checkInRequest)).rejects.toBeInstanceOf(
            MaxNumberOfCheckInsError
        );
    });

    it("should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

        await sut.execute(checkInRequest);

        vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute(checkInRequest);

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in on distant gym", async () => {
        await gymRepository.create({
            id: "gym-02",
            title: "",
            description: "",
            latitude: -22.7506476,
            longitude: -47.0236254,
            phone: "",
            created_at: new Date()
        });

        checkInRequest = {
            userId: "user-01",
            gymId: "gym-02",
            userLatitude: -22.7568428,
            userLongitude: -47.0170228
        };

        await expect(() => sut.execute(checkInRequest)).rejects.toBeInstanceOf(
            MaxDistanceError
        );
    });
});
