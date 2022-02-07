import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Constants } from './common/constants';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [MongooseModule.forRoot(Constants.MONGODB_CONNECTION), LessonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
