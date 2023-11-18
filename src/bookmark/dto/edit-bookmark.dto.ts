import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EditBookmarkDto{
    @IsString()
    @IsOptional()
    title?:string;

    @IsString()
    @IsOptional()
    Description?:string;

    @IsString()
    @IsOptional()
    link?:string;
}