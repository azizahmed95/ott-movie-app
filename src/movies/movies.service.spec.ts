import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './schemas/movie.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { MovieDto } from './Dto/movie.dto';
import { User } from 'src/auth/schemas/user.schema';

describe('MoviesService', () => { 

  let movieService:MoviesService;
  let modelMock:Model<Movie>;

  const mockMovieService = {
    getSingleMovieById: jest.fn(),
  };

  const sampleGetMovieIdData = {
    "_id": "6576b94a9b10a63e50d56373",
    "title": "The Untold Storyr5",
    "genre_name": "Comedy",
    "rating": {
        "$numberDecimal": "4"
    },
    "streaming_url": "https://www.vudu.com/content/movies/details/The-Untold-Story/128837",
    "released_year": 2019,
    "user": "6575e294df14a5b2a1493be9"
  };

  beforeEach(async () => { 

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService
      ],
    }).compile();

    movieService = module.get<MoviesService>(MoviesService);
  });

  describe('getSingleMovieById', () => { 
  
    it('should find data by ID', async() => { 
  
      jest.spyOn(Model, 'findById').mockResolvedValue(sampleGetMovieIdData);
  
      const result = await movieService.getSingleMovieById(sampleGetMovieIdData._id);

      expect(modelMock.findById).toHaveBeenCalledWith(sampleGetMovieIdData._id);
      expect(result).toEqual(sampleGetMovieIdData);
    });

    it('should throw an error if data is not found', async() => { 
      
      jest.spyOn(Model, 'findById').mockResolvedValue(null);

      const result = await movieService.getSingleMovieById(sampleGetMovieIdData._id);

      expect(modelMock.findById).toHaveBeenCalledWith(sampleGetMovieIdData._id);
      await expect(result).rejects.toThrow(
        NotFoundException
      );
      
    });
    
  });

  describe('addMovieToDb', () => { 

    const newMovieData:any = {
      "title": "The Untold Storyr6",
      "genre_name": "Comedy",
      "rating": 4,
      "streaming_url": "https://www.vudu.com/content/movies/details/The-Untold-Story/128837",
      "released_year": 2019,
    }

    const mockUser = {
      _id : "6575e294df14a5b2a1493be9",
      name : "jack",
      email : "test1@gmail.com"
    }

    it('should add a new movie in the lists', async() => { 
      
      jest.spyOn(Model, 'create').mockImplementationOnce(() => Promise.resolve(newMovieData))
      
      const result = await movieService.addMovieToDb(newMovieData as MovieDto, mockUser as User);

      expect(result).toEqual(sampleGetMovieIdData);
    });

  });

});
