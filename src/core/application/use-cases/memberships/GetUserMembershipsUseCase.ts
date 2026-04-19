import { Membership } from "../../../domain/models/Membership";
import { MembershipRepository } from "../../../domain/repositories/MembershipRepository";

export class GetUserMembershipsUseCase {
    constructor(private membershipRepository: MembershipRepository) {}

    async execute(userId: string): Promise<Membership[]> {
        return this.membershipRepository.getUserMemberships(userId);
    }
}
