import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Constants } from './common/constants';
import { LessonsModule } from './module/lessons/lessons.module';
import { AllExceptionsFilter } from './utilities';

@Module({
  imports: [MongooseModule.forRoot(Constants.MONGODB_CONNECTION), LessonsModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule { }
