import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EditedDate, EditedDateSchema, Lesson, LessonSchema } from 'src/data/model';
import { LessonRepository } from 'src/data/repository';
import { LessonsController } from './lessons.controller';
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
