import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto } from './dto/request';

@Injectable()
export class LessonsRepository {
    constructor(
        @InjectModel(Lesson.name)
        private lessonModel: Model<Lesson>
    ) { }

    async findAll(): Promise<Lesson[]> {
        return this.lessonModel.find().exec();
    }

    async addLesson(addLessonDto: AddLessonDto): Promise<Lesson> {
        const newLesson = new this.lessonModel(addLessonDto);
        return newLesson.save();
    }
}
