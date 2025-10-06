import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    avatarUrl: string;
}
