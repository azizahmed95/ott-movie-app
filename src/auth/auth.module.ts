import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'User', schema:UserSchema}]),
    PassportModule.register({ defaultStrategy:'jwt' }),
    
    JwtModule.registerAsync({
        inject:[ConfigService],
        useFactory:(config:ConfigService) => { 
            return {
                secret:config.get<string>('JWT_SECRET_KEY'),
                signOptions:{ 
                    expiresIn : config.get<string | number>('JWT_EXPIRES'),
                }
            }
        }
    })
  ], 
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[JwtStrategy, PassportModule]
})
export class AuthModule {}
