import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './data/lessons.schema';
import { RepeatedIntervals, RepeatedIntervalsSchema } from './data/repeated-intervals.schema';
import { LessonsController } from './lessons.controller';
import { LessonsRepository } from './lessons.repository';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: RepeatedIntervals.name, schema: RepeatedIntervalsSchema },
    ])
  ],
  controllers: [LessonsController],
  providers: [LessonsService, LessonsRepository]
})
export class LessonsModule { }
