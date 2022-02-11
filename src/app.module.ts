import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Constants } from './common/constants';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [MongooseModule.forRoot(Constants.MONGODB_CONNECTION), LessonsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
