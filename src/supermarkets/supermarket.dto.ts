import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class SupermarketDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly longitude: number;

    @IsNumber()
    @IsNotEmpty()
    readonly latitude: number;

    @IsUrl()
    @IsNotEmpty()
    readonly website: string;
}
