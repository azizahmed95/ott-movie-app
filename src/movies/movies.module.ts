import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreSchema } from './schemas/genre.schema';
import { MovieSchema } from './schemas/movie.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name:'Genre', schema:GenreSchema },
      { name:'Movie', schema:MovieSchema}
    ]),
    AuthModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MoviesModule {}
