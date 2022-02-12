import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BetweenDatesInterface } from 'src/interface';
import { AddLessonDto } from '../../dto/request';
import { Lesson } from '../model';


@Injectable()
export class LessonRepository {
    private logger = new Logger('LessonRepository');
    constructor(
        @InjectModel(Lesson.name)
        private lessonModel: Model<Lesson>
    ) { }

    async addLesson(addLessonDto: AddLessonDto): Promise<Lesson> {
        const newLesson = new this.lessonModel(addLessonDto);
        return newLesson.save();
    }

    public async getLessonById(id: string): Promise<Lesson> {
        return this.lessonModel.findById(id);
    }

    public async updateLesson(lesson: Lesson): Promise<Lesson> {
        return this.lessonModel.findOneAndUpdate({ _id: lesson.id }, lesson, { returnOriginal: false });
    }

    public async getLessonsBetweenDates(betweenDates: BetweenDatesInterface): Promise<Lesson[]> {
        return this.lessonModel.find({
            $nor: [
                {
                    $and: [
                        { 'firstLessonStartsAt': { $lte: betweenDates.from } },
                        { 'lastLessonEndsAt': { $lte: betweenDates.from } },
                    ]
                },
                {
                    $and: [
                        { 'firstLessonStartsAt': { $gte: betweenDates.to } },
                        { 'lastLessonEndsAt': { $gte: betweenDates.to } },
                    ]
                }
            ]
        });
    }

    public async deleteLesson(lesson: Lesson) {
        return this.lessonModel.findOneAndDelete({ _id: lesson.id });
    }
}
