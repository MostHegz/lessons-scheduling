import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DateExclusion, DateExclusionSchema } from './data/exclusion-date.schema';
import { Lesson, LessonSchema } from './data/lessons.schema';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: DateExclusion.name, schema: DateExclusionSchema },
    ])
  ],
  controllers: [LessonsController],
  providers: [LessonsService]
})
export class LessonsModule { }
