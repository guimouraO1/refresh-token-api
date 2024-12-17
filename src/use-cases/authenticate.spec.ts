import { describe } from "node:test";
import { beforeEach, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateUserRequest {
    email: string;
    password: string;
}

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
let testUser: AuthenticateUserRequest;

describe("Authenticate use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);

        testUser = {
            email: "Jhondoe@example.com",
            password: "123456"
        };
    });

    it("should be able to authenticate", async () => {
        await usersRepository.create({
            name: "Jhon Doe",
            email: testUser.email,
            password_hash: await hash(testUser.password, 6)
        });

        const { user } = await sut.execute(testUser);

        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to authenticate with wrong email", async () => {
        await expect(() => sut.execute(testUser)).rejects.toBeInstanceOf(
            InvalidCredentialsError
        );
    });

    it("should not be able to authenticate with wrong email", async () => {
        await usersRepository.create({
            name: "Jhon Doe",
            email: testUser.email,
            password_hash: await hash("WrongPassword", 6)
        });

        await expect(() => sut.execute(testUser)).rejects.toBeInstanceOf(
            InvalidCredentialsError
        );
    });
});
