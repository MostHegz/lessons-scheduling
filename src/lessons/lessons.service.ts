import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ErrorMessage } from 'src/common';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto } from './dto/request';
import { LessonsRepository } from './lessons.repository';

@Injectable()
export class LessonsService {
    private logger = new Logger('LessonsService');
    constructor(private readonly lessonsRepository: LessonsRepository) { }

    async addLesson(addLessonDto: AddLessonDto): Promise<Lesson> {
        return new Promise(async (resolve, reject) => {
            try {
                // TODO: get user id from token and add recurring lessons

                const addedLesson = await this.lessonsRepository.addLesson(addLessonDto);
                resolve(addedLesson);
            } catch (error) {
                this.logger.error(error);
                reject(error);
            }
        });
    }

    async findAll(): Promise<Lesson[]> {
        return this.lessonsRepository.findAll();
    }

}
