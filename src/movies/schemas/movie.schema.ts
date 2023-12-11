import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Genre } from "./genre.schema";

@Schema({
    timestamps:true,
})
export class Movie { 

    @Prop({required:true})
    title:string;

    @Prop()
    genre_name:string;

    @Prop()
    rating:mongoose.Schema.Types.Decimal128;

    @Prop()
    streaming_url:string;

    @Prop()
    released_year:number;

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'User'})
    user:User;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);