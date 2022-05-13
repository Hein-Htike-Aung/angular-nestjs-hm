import { IsNotEmpty, IsString } from "class-validator";

export class CredentailInfo {
    @IsString()
    username: string;
    @IsString()
    password: string;
}