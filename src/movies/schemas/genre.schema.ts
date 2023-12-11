import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps:true,
})
export class Genre { 
  
    @Prop({unique:true})
    genre_name:string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);