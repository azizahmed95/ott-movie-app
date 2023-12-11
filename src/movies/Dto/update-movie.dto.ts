import { IsOptional, IsString, IsNumber,Min, Max, IsEmpty } from "class-validator";
import mongoose from 'mongoose';
import { User } from "src/auth/schemas/user.schema";

export class UpdateMovieDto { 

    @IsOptional()
    @IsString()
    title:string;

    @IsOptional()
    @IsString()
    genre_name:string;

    @IsOptional()
    @IsNumber()
    @Min(1, { message : "Rating must be atleast 1"})
    @Max(5, { message : "Rating must be atmost 5" })
    rating:mongoose.Schema.Types.Decimal128;

    @IsOptional()
    streaming_url:string;

    @IsOptional()
    @IsNumber()
    released_year:number;

    @IsEmpty({message : 'User id cannot be passed manually'})
    user:User

}