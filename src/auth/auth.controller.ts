import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService) { }
    
    @Post('/signup')
    async signUp(@Body() signupDto:signUpDto): Promise<{ token:string }> { 
        return this.authService.signUp(signupDto);
    }

    @Post('/login')
    login(@Body() loginDto:LoginDto): Promise<{ token:string }> { 
        return this.authService.login(loginDto);
    }
}
