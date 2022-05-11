import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateSubDivisionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    divisionId: number;
}