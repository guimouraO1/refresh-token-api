import { describe } from "node:test";
import { beforeEach, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
let testUser: CreateUserRequest;

describe("Register use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);

        testUser = {
            name: "Jhon Doe",
            email: "Jhondoe@example.com",
            password: "123456"
        };
    });

    it("should be able to register", async () => {
        const { user } = await sut.execute(testUser);

        expect(user.id).toEqual(expect.any(String));
    });

    it("should hash user password upon registration", async () => {
        const { user } = await sut.execute(testUser);

        const isPasswordCorrectlyHashed = await compare(
            testUser.password,
            user.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("should not be able to register with same email twice", async () => {
        await sut.execute(testUser);

        await expect(() => sut.execute(testUser)).rejects.toBeInstanceOf(
            UserAlreadyExistsError
        );
    });
});
