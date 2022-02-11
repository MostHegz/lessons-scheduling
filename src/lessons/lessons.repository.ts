import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto, GetLessonsDto } from './dto/request';


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

    public async getLessonsBetweenDates(getLessonsDto: GetLessonsDto): Promise<Lesson[]> {
        return this.lessonModel.find({
            $nor: [
                {
                    $and: [
                        { 'firstLessonStartsAt': { $lte: getLessonsDto.from } },
                        { 'lastLessonEndsAt': { $lte: getLessonsDto.from } },
                    ]
                },
                {
                    $and: [
                        { 'firstLessonStartsAt': { $gte: getLessonsDto.to } },
                        { 'lastLessonEndsAt': { $gte: getLessonsDto.to } },
                    ]
                }
            ]
        });
    }
}
