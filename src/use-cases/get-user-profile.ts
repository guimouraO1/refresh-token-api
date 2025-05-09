import { UsersRepository } from "./../repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetProfileUseCaseRequest {
    userId: string;
}

interface GetProfileUseCaseResponse {
    user: User;
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ userId }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return { user };
    }
}
