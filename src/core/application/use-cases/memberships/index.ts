import { membershipRepository } from "../../../infrastructure";
import { GetUserMembershipsUseCase } from "./GetUserMembershipsUseCase";

export const getUserMembershipsUseCase = new GetUserMembershipsUseCase(membershipRepository);
