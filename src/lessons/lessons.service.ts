import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
                // TODO: get user id from token
                // TODO: map response
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
}
