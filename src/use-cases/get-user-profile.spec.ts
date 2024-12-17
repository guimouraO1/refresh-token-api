import { describe } from "node:test";
import { beforeEach, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GerProfileUserRequest {
    name: string;
    email: string;
    password_hash: string;
}

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
let testUser: GerProfileUserRequest;

describe("Get profile use case", () => {
    beforeEach(async () => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);

        testUser = {
            name: "Jhon Doe",
            email: "Jhondoe@example.com",
            password_hash: await hash("123456", 6)
        };
    });

    it("should be able to get user profile", async () => {
        const createdUser = await usersRepository.create(testUser);

        const { user } = await sut.execute({ userId: createdUser.id });

        expect(user.name).toEqual(testUser.name);
        expect(user.email).toEqual(testUser.email);
    });

    it("should not be able to get user profile with wrong id", async () => {
        await expect(() =>
            sut.execute({ userId: "non-existing-id" })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
