import { IsNotEmpty, IsString } from "class-validator";

export class GenreDto { 

    @IsNotEmpty()
    genre_name:string;
}