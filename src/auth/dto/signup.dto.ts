import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class signUpDto { 
    
    @IsNotEmpty()
    @IsString()
    readonly name:string;

    @IsNotEmpty()
    @IsEmail({}, { message:'Please enter a valid email' })
    readonly email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password:any;

}
