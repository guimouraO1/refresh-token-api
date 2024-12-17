import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

interface SearchGymsRequest {
    query: string;
    page: number;
}

let gymsRepository: InMemoryGymRepository;
let sut: SearchGymsUseCase;
let userRequest: SearchGymsRequest;

describe("Search Gyms use case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it("should be able to search gyms", async () => {
        await gymsRepository.create({
            title: "JavaScript",
            latitude: -22.7568428,
            longitude: -47.0170228,
            description: "",
            phone: ""
        });

        await gymsRepository.create({
            title: "TypeScript",
            latitude: -22.7568428,
            longitude: -47.0170228,
            description: "",
            phone: ""
        });

        userRequest = {
            query: "TypeScript",
            page: 1
        };

        const { gyms } = await sut.execute(userRequest);

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "TypeScript" })
        ]);
    });

    it("should be able to fetch paginated gyms search", async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                latitude: -22.7568428,
                longitude: -47.0170228,
                description: "",
                phone: ""
            });
        }

        userRequest = {
            query: "JavaScript",
            page: 2
        };

        const { gyms } = await sut.execute(userRequest);

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "JavaScript Gym 21" }),
            expect.objectContaining({ title: "JavaScript Gym 22" })
        ]);
    });
});
