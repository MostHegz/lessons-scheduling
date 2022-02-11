import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EditedDate, EditedDateSchema } from './data/edited-date.schema';
import { Lesson, LessonSchema } from './data/lessons.schema';
import { LessonsController } from './lessons.controller';
import { LessonRepository } from './lessons.repository';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: EditedDate.name, schema: EditedDateSchema },
    ])
  ],
  controllers: [LessonsController],
  providers: [LessonsService, LessonRepository]
})
export class LessonsModule { }
