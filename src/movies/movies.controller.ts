import { Controller, Body, Get, Post, Param, Put, Query, Res, Delete, UseGuards, Req } from '@nestjs/common';
import { status_code } from 'src/common/config/status_codes';
import { MoviesService } from './movies.service';
import * as _ from 'underscore';
import { MovieDto } from './Dto/movie.dto';
import { UpdateMovieDto } from './Dto/update-movie.dto';
import {AuthGuard} from "@nestjs/passport";
import { GenreDto } from './Dto/genre.dto';

@Controller('movies')
export class MoviesController {

    constructor(
        private readonly moviesService : MoviesService
    ) {}

    @Get()
    async getAllMovieLists(@Res() res):Promise<Object> { 
        
        let response:Object = {};

        try { 
            const getlists = await this.moviesService.getMovieLists();

            if(getlists['status'] == 'success') { 
                response['data'] = Object.assign({}, status_code.success);
                response['data'] = {};
                response['data'] = getlists['movie_lists'];
            }
            else { 
                response['data'] = Object.assign({}, status_code.fatal_error);
                response['data']['msg'] = getlists['msg'];
            }
        }
        catch(err) { 
            console.log("error occured in movie controller : ", err);
        }

        return res.send(response);
    }

    @Get('/findOneMovie/:id')
    async findMoviesById(@Res() res, @Param('id') id:string):Promise<Object> { 
        let response:Object = {};
        try { 
            let getmoviedata = await this.moviesService.getSingleMovieById(id);

            if(getmoviedata['status'] == 'success') { 
                response = Object.assign({}, status_code.success);
                response["data"] = {};
                response["data"]["result"] = getmoviedata["result"];
            }
            else { 
                response = Object.assign({}, status_code.fatal_error);
                response["data"] = {};
                response["data"]["msg"] = getmoviedata["msg"];
            }
        }
        catch(err) { 
            response = Object.assign({}, status_code.fatal_error);
            response["data"] = {};
            response["data"]["msg"] = "Error Occurred : "+ err;
        }
        return res.send(response);
    }

    @Get('genretypes')
    async getGenreCategories(@Res() res):Promise<Object> { 
        let response:Object = {};

        try { 
            let genre_category_lists = await this.moviesService.getGenreCategories();
            // console.log("resp => ", genre_category_lists);

            if(genre_category_lists['status'] == 'success') { 
                response = Object.assign({}, status_code.success);
                response['data'] = {};
                response['data'] = genre_category_lists['genre_list'];
            }
            else { 
                response = Object.assign({}, status_code.fatal_error);
                response = genre_category_lists;
            }
        }
        catch(err) { 
            console.log("error occured in movie controller : ", err);
            response = Object.assign({}, status_code.fatal_error);
            response["data"] = {};
            response["data"]["msg"] = "Error Occurred : "+ err;
        }
        return res.send(response);
    }

    @Post('addnewmovie')
    @UseGuards(AuthGuard())       // for protecting routes to access by admin login only
    async addNewMovie( @Req() req, @Res() res, @Body() movieDto:MovieDto):Promise<Object> { 
        let response:Object = {};

        try { 
            let user = req.user;
            console.log("user => ", req.user);
            let createMovie = await this.moviesService.addMovieToDb(movieDto, user);

            if(createMovie['status'] == 'success') { 
                response = Object.assign({}, status_code.success);
                response['data'] = {};
            }
            else { 
                response = Object.assign({}, status_code.fatal_error);
                response["data"] = {};
            }
            response['data']['msg'] = createMovie['msg'];
        }
        catch(err) { 
            response = Object.assign({}, status_code.fatal_error);
            response["data"] = {};
            response["data"]["msg"] = "Error Occurred : "+ err;
        }
        return res.send(response);
    }

    @Get('search')
    async searchMovies( @Res() res, @Query('title') title:string, @Query('genre') genre:string):Promise<Object> { 
        let response:Object = {};
 
        try { 
            let search_data = await this.moviesService.searchMovieLists(title, genre);

            if(search_data['status'] == 'success') { 
                response = Object.assign({}, status_code.success);
                response['data'] = {};
                response['data'] = search_data['search_result'];
            }
            else {
                response['data'] = Object.assign({}, status_code.fatal_error);
                response['data'] = {};
            }
            response['data']['msg'] = search_data['msg'];
        }
        catch(err) { 
            response = Object.assign({}, status_code.fatal_error);
            response["data"] = {};
            response["data"]["msg"] = "Error Occurred : "+ err;
        }

        return res.send(response);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateMoviesData( @Res() res, @Param('id') id:string, @Body() udpateMovieDto:UpdateMovieDto) : Promise<Object> { 

        let response:Object = {};
        try { 
            let update_movie = await this.moviesService.updateMoviesExistingData(id, udpateMovieDto);

            if(update_movie['status'] == 'success') { 
                response = Object.assign({}, status_code.success);
                response["data"] = {};
            }
            else { 
                response = Object.assign({}, status_code.fatal_error);
                response["data"] = {};
            }
            response["data"]['msg'] = update_movie['msg'];
        }
        catch(err) { 
            response = Object.assign({}, status_code.fatal_error);
            response["data"] = {};
            response["data"]["msg"] = "Error Occurred : "+ err;
        }
        return res.send(response);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteMovieData( @Res() res, @Param('id') id:string) { 
        let response:Object = {};
        
        try { 
            let delete_data = await this.moviesService.deleteMovieData(id); 

            if(delete_data['status'] == 'success') { 
                response = Object.assign({}, status_code.success);
                response["data"] = {};
            }
            else { 
                response = Object.assign({}, status_code.fatal_error);
                response["data"] = {};
            }
            response["data"]['msg'] = delete_data['msg'];
        }
        catch(err) { 
            response = Object.assign({}, status_code.fatal_error);
            response["data"] = {};
            response["data"]["msg"] = "Error Occurred : "+ err;
        }
        return res.send(response);
    }

    @Post('addnewgenre')
    async addNewGenre(@Res() res, @Body() genreDto:GenreDto[]):Promise<Object> { 

        let response:Object = {};

        try { 
            let addNewCategory = await this.moviesService.addNewGenreCategory(genreDto);

            if(addNewCategory['status'] == 'success') { 
                response = Object.assign({}, status_code.success);
                response["data"] = {};
            }
            else { 
                response = Object.assign({}, status_code.fatal_error);
                response["data"] = {};     
            }
            response["data"]["msg"] = addNewCategory["msg"];
        }
        catch(err) { 
            response = Object.assign({}, status_code.fatal_error);
            response["data"] = {};
            response["data"]["msg"] = "Error Occurred : "+ err;
        }
        return res.send(response);
    }

}
