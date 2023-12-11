/* for authorization */
import { Injectable, UnauthorizedException , BadRequestException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt,Strategy } from "passport-jwt";
import { User } from "./schemas/user.schema";
import mongoose from "mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 

    constructor(
        @InjectModel(User.name)
        private userModel:mongoose.Model<User>,
    ) { 
        console.log("key ",  process.env.JWT_SECRET_KEY);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    async validate(payload) {  
        const {id} = payload;

        const user = await this.userModel.findById(id);
        console.log("usr => ", user);

        if(!user) { 
            console.log("here..");
            throw new BadRequestException('Please login first!');
        }

        return user;
    }
}