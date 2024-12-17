import { describe } from "node:test";
import { beforeEach, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

interface FetchUserCheckInsHistoryRequest {
    userId: string;
    page: number;
}

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;
let userRequest: FetchUserCheckInsHistoryRequest;

describe("Fecth user check-in history use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
    });

    it("should be able to fetch check-in history", async () => {
        await checkInsRepository.create({
            user_id: "user-01",
            gym_id: "gym-01"
        });

        await checkInsRepository.create({
            user_id: "user-01",
            gym_id: "gym-02"
        });

        userRequest = {
            userId: "user-01",
            page: 1
        };

        const { checkIns } = await sut.execute(userRequest);

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-01" }),
            expect.objectContaining({ gym_id: "gym-02" })
        ]);
    });

    it("should be able to fetch paginated user check-in history", async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                user_id: "user-01",
                gym_id: `gym-${i}`
            });
        }

        userRequest = {
            userId: "user-01",
            page: 2
        };

        const { checkIns } = await sut.execute(userRequest);

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-21" }),
            expect.objectContaining({ gym_id: "gym-22" })
        ]);
    });
});
