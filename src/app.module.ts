import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MoviesModule,
    ConfigModule.forRoot({ 
      envFilePath : '.env',
      isGlobal : true,
    }),
    MongooseModule.forRoot(process.env.MONGOOSE_DB_CONNECTION_STRING),
    AuthModule,
  ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}
