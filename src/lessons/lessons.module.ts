import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './data/lessons.schema';
import { RepeatedIntervals, RepeatedIntervalsSchema } from './data/repeated-intervals.schema';
import { LessonsController } from './lessons.controller';
import { LessonsRepository } from './lessons.repository';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Lesson.name,
        useFactory: () => {
          const schema = LessonSchema;
          schema.pre<Lesson>('save', function () {
            const lesson = this;
            if (lesson.repeatedIntervals?.length > 1) {
              this.isRepeated = true;
            }
          });
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: RepeatedIntervals.name, schema: RepeatedIntervalsSchema },
    ])
  ],
  controllers: [LessonsController],
  providers: [LessonsService, LessonsRepository]
})
export class LessonsModule { }
