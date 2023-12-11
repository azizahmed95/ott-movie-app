import { IsNotEmpty, IsString, IsNumber, length, IsDecimal, Min, Max, IsEmpty } from "class-validator";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";

export class MovieDto { 

    @IsNotEmpty()
    title:string;

    @IsNotEmpty()
    genre_name:string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message : "Rating must be atleast 1"})
    @Max(5, { message : "Rating must be atmost 5" })
    rating:mongoose.Schema.Types.Decimal128;

    @IsNotEmpty()
    streaming_url:string;

    @IsNotEmpty()
    released_year:number;

    @IsEmpty({message : 'User id cannot be passed manually'})
    user:User
}
