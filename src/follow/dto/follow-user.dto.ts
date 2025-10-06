import {IsString } from "class-validator";

export class FollowUserDTO {
    @IsString()
    followUserUsername?: string;

    @IsString()
    unfollowUserUsername?: string;
}
