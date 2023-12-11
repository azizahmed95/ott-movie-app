import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './schemas/genre.schema';
import { Movie } from './schemas/movie.schema';
import * as mongoose from 'mongoose';
import * as _ from 'underscore';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class MoviesService {

    constructor(
        @InjectModel(Genre.name) private readonly genreModel:mongoose.Model<Genre>,
        @InjectModel(Movie.name) private readonly movieModel:mongoose.Model<Movie>,
    ) {}

    async getMovieLists():Promise<Object> { 
        let data:Object = {};

        try { 
            let get_movies = await this.movieModel.find({}, { _id:0,createdAt:0, updatedAt:0, __v:0});

            if(!_.isEmpty(get_movies)) { 
                data['status'] = 'success';
                data['movie_lists'] = get_movies;
                data['msg'] = 'Lists fetched successfully!';
            }
            else { 
                data['status'] = 'error';
                data['msg'] = 'No movie list found!';
            }
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = 'Error occured in service getMovieLists : '+ err.message;
        }
        return data;
    }

    async getSingleMovieById(id:string):Promise<Object> { 
        let data:Object = {};

        try { 
            const isValidId = mongoose.isValidObjectId(id);

            if(!isValidId) {  
                throw new BadRequestException(`Please pass a valid ID`);
            }
            
            let fetchSingleMovie = await this.movieModel.findById(id, { createdAt:0, updatedAt:0, __v:0});
            console.log("resp => ", fetchSingleMovie);

            if (!fetchSingleMovie) {
                throw new NotFoundException(`Data with ID ${id} not found`);
              }
            
            data['status'] = 'success';
            data['result'] = fetchSingleMovie;
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = 'Error occured in service getSingleMovieById '+ err;
        }
        return data;
    }

    async getGenreCategories():Promise<Object> { 
        let data:Object = {};

        try { 
            let genre_data = await this.genreModel.find();
            
            if(!_.isEmpty(genre_data)) { 
                data['status'] = 'success';
                data['genre_list'] = genre_data;
            }
            else { 
                data['status'] = 'error';
                data['msg'] = 'No list found!';
            }
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = 'Error occured in service getGenreCategories : '+ err;
        }
        return data;
    }

    async addMovieToDb(movie:Movie, user:User):Promise<Object> { 
       
        let data:any = [];
        // console.log("inp params => ", movie);
        try { 

            let {genre_name} = movie;

            //check if the genre is present in the document
            const query:any = {genre_name:genre_name};

            let check_genre_valid = await this.genreModel.find(query);
            // console.log(check_genre_valid);
            
            if(!_.isEmpty(check_genre_valid)) { 

                movie = Object.assign(movie, {user : user._id});
                let add_new_movie = await this.movieModel.create(movie);

                if(!_.isEmpty(add_new_movie)) { 
                    data['status'] = 'success';
                    data['msg'] = "New movie added succesfully";
                }
                else { 
                    data['status'] = 'error';
                    data['msg'] = "Error occurred while adding record to DB!";
                }
            }
            else { 
                data['status'] = 'error';
                data['msg'] = "Genre Category you entered is not found in Database, Please try adding different Genre!";
            }
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = "Error occured in service addMovieToDb : "+ err;
        }
        return data;
    }

    async searchMovieLists(title:string, genre:string) { 
        
        let searched_data:Object = {};
        let data:Object = {};

        try { 
            let pipeline = [];

            let srch1 = {
                    $match: { 
                        genre_name: { $regex: new RegExp(genre, 'i')}
                    }
                };
            pipeline.push(srch1)

            let srch2 =  {
                $match: { 
                    title: { $regex: new RegExp(title,'i')}
                }
            }; 
            pipeline.push(srch2);

            searched_data = await this.movieModel.aggregate(pipeline);
            console.log("srch data => ", searched_data); 

            if(!_.isEmpty(searched_data)) { 
                data['status'] = 'success';
                data['search_result'] = searched_data;
                data['msg'] = "Search result lists fetched successfully!";
            }
            else { 
                data['status'] = 'error';
                data['msg'] = "No result found!";
            }
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = "Error occured in service searchMovieLists : "+ err;
        }
        return data;
    }

    async updateMoviesExistingData(id:string, updateMovieData:Movie):Promise<Object> { 

        let data:Object = {};
        try { 
            let update_data = await this.movieModel.findByIdAndUpdate(id, updateMovieData, { new:true, runValidators:true});

            if(!_.isEmpty(update_data)) { 
                data['status'] = 'success';
                data['msg'] = 'Data updated successfully!';
            }
            else { 
                data['status'] = 'error';
                data['msg'] = 'Error occured while updating data, please try again!';
            }
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = "Error occured in service updateMoviesExistingData : "+ err;
        }
        return data;
    }

    async deleteMovieData(id:string):Promise<Object> { 
        let data:Object = {};

        try { 
            let delete_response = await this.movieModel.findByIdAndDelete(id); 

            if(!_.isEmpty(delete_response)) { 
                data['status'] = 'success';
                data['msg'] = 'Data deleted successfully!';
            }
            else { 
                data['status'] = 'error';
                data['msg'] = 'Error occured while deleting data, please try again!';
            }
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = "Error occured in service deleteMovieData : "+ err;
        }
        return data;
    }

    async addNewGenreCategory(genreDataArgs:Genre[]):Promise<Object> { 
        let data:Object = {};
        console.log(genreDataArgs);
        try { 
            let add_genre_to_lists = await this.genreModel.insertMany(genreDataArgs);

            if(!_.isEmpty(add_genre_to_lists)) { 
                data['status'] = 'success';
                data['msg'] = "New genre category is added succesfully";
            }
            else { 
                data['status'] = 'error';
                data['msg'] = "Error occurred while adding record to DB!";
            }
        }
        catch(err) { 
            data['status'] = 'error';
            data['msg'] = "Error occured in service addNewGenreCategory "+ err;
        }
 
        return data;
    }

}
