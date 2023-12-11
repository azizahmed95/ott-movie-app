import { BadRequestException, Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist';
import { signUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectModel(User.name)
        private userModel:mongoose.Model<User>,
        private jwtService:JwtService
    ) {}

    async signUp(signUpDto:signUpDto):Promise<{token:string}> { 
        let response;

        const { name, email, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            name,
            email,
            password:hashedPassword
        });

        if(!user) { 
            throw new BadRequestException("Duplicate email exist!");
        }

        const token = this.jwtService.sign({            // assigns a jwt token to the user
            id:user._id
        });

        response = {
            token : token,
            message : 'User Signedup succesfully'
        };
        return response;
    }

    async login(loginDto:LoginDto):Promise<{token:string}> { 
        
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });

        if(!user) { 
            throw new UnauthorizedException('Invalid email or password!');
        }

        const isPassValid = await bcrypt.compare(password, user.password);

        if(!isPassValid) { 
            throw new UnauthorizedException('Invalid email or password!');
        }

        const token = this.jwtService.sign({id:user._id});
        
        let response = { 
            token : token,
            message : 'User logged-in succesfully'
        };

        return response;
    }
}
