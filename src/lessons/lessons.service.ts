import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecurrenceType } from 'src/common';
import { RRuleWithExcludedDates } from 'src/utilities';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto } from './dto/request';


@Injectable()
export class LessonsService {
    private logger = new Logger('LessonsService');
    constructor(
        @InjectModel(Lesson.name)
        private lessonModel: Model<Lesson>
    ) { }

    async addLesson(addLessonDto: AddLessonDto): Promise<Lesson> {
        return new Promise(async (resolve, reject) => {
            try {
                const newLesson = new this.lessonModel(addLessonDto);
                const addedLesson = await newLesson.save();
                resolve(addedLesson);
            } catch (error) {
                this.logger.error(error);
                if (error instanceof HttpException) {
                    reject(error);
                }
                return reject(new InternalServerErrorException());
            }
        });
    }

    public async getLessonById(id: string): Promise<Lesson> {
        return this.lessonModel.findById(id);
    }

    public async updateLesson(lesson: Lesson): Promise<Lesson> {
        const updated = await this.lessonModel.findOneAndUpdate({ _id: lesson.id }, lesson, { returnOriginal: false });
        return updated;
    }

    public mapLessonDates(lesson: Lesson): Lesson {

        if (lesson.recurrence === RecurrenceType.None) {
            lesson.occursAt = [{
                date: lesson.firstLessonStartsAt,
                durationInMilliSeconds: lesson.durationInMilliSeconds
            }];
        } else {
            const rruleDates = new RRuleWithExcludedDates(
                lesson.firstLessonStartsAt,
                lesson.lastLessonEndsAt,
                lesson.editedDates,
                lesson.excludedDates,
                lesson.durationInMilliSeconds,
                lesson.recurrenceDays,
                lesson.recurrence
            );

            lesson.occursAt = rruleDates.getAll();
        }
        return lesson;
    }
}
