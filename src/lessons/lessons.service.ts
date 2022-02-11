import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ErrorMessage, LessonUpdateType, RecurrenceType } from 'src/common';
import { MapperHelper, RRuleWithExcludedDates } from 'src/utilities';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto, UpdateLessonDto } from './dto/request';
import { LessonResponse } from './dto/response';
import { LessonRepository } from './lessons.repository';

@Injectable()
export class LessonsService {
    private logger = new Logger('LessonsService');
    constructor(
        private readonly lessonRepository: LessonRepository
    ) { }

    public async addLesson(addLessonDto: AddLessonDto): Promise<LessonResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                // TODO: get user id from token instead of request body
                if (addLessonDto.recurrence !== RecurrenceType.Weekly) {
                    addLessonDto.recurrenceDays = [];
                }

                if (addLessonDto.recurrence === RecurrenceType.None) {
                    const firstLessonStartsAt = addLessonDto.firstLessonStartsAt.getTime();
                    addLessonDto.lastLessonEndsAt = new Date(firstLessonStartsAt + addLessonDto.durationInMilliSeconds);
                }

                const addedLesson = await this.lessonRepository.addLesson(addLessonDto);
                const lessonWithDates = this.mapLessonDates(addedLesson);
                const response = MapperHelper.toClient(LessonResponse, lessonWithDates);
                resolve(response);
            } catch (error) {
                this.logger.error(error);
                reject(error);
            }
        });
    }

    public async updateLesson(updateLessonDto: UpdateLessonDto): Promise<LessonResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const lesson = await this.lessonRepository.getLessonById(updateLessonDto.lessonId);
                if (!lesson) {
                    throw new HttpException({ key: ErrorMessage.LessonRequired }, HttpStatus.NOT_FOUND);
                }

                if (updateLessonDto.recurrence !== RecurrenceType.Weekly) {
                    updateLessonDto.recurrenceDays = [];
                }

                if (updateLessonDto.recurrence === RecurrenceType.None) {
                    const firstLessonStartsAt = updateLessonDto.firstLessonStartsAt.getTime();
                    updateLessonDto.lastLessonEndsAt = new Date(firstLessonStartsAt + updateLessonDto.durationInMilliSeconds);
                }

                lesson.title = updateLessonDto.title;
                lesson.description = updateLessonDto.description;
                lesson.firstLessonStartsAt = new Date(updateLessonDto.firstLessonStartsAt.toUTCString());
                lesson.lastLessonEndsAt = new Date(updateLessonDto.lastLessonEndsAt.toUTCString());
                lesson.recurrenceDays = updateLessonDto.recurrenceDays;
                lesson.recurrence = updateLessonDto.recurrence;

                switch (updateLessonDto.type) {
                    case LessonUpdateType.All:
                        lesson.durationInMilliSeconds = updateLessonDto.durationInMilliSeconds;
                        break;

                    case LessonUpdateType.Single:
                    case LessonUpdateType.DeleteSingle:
                        const oldLessonWithDates = this.mapLessonDates(lesson);
                        const foundDate = oldLessonWithDates.occursAt.find(old => old.date.toDateString() === updateLessonDto.oldDate.toDateString());
                        if (!foundDate) {
                            throw new HttpException({ key: ErrorMessage.LessonNotAtThisDate }, HttpStatus.NOT_FOUND);
                        }
                        lesson.excludedDates.push(updateLessonDto.oldDate);

                        if (updateLessonDto.type === LessonUpdateType.Single) {
                            lesson.editedDates.push({
                                date: updateLessonDto.newDate ? updateLessonDto.newDate : updateLessonDto.oldDate,
                                durationInMilliSeconds: updateLessonDto.durationInMilliSeconds
                            });
                        }
                        break;

                }
                const updatedLesson = await this.lessonRepository.updateLesson(lesson);
                const lessonWithDates = this.mapLessonDates(updatedLesson);
                const response = MapperHelper.toClient(LessonResponse, lessonWithDates);
                resolve(response);
            } catch (error) {
                this.logger.error(error);
                reject(error);
            }
        });
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
