import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RecurrenceType, LessonUpdateType, LessonDeleteType, ErrorMessage, SuccessMessage } from 'src/data/enum';
import { Lesson } from 'src/data/model';
import { LessonRepository } from 'src/data/repository';
import { BetweenDatesInterface, DateWithDurationInterface } from 'src/interface';
import { MapperHelper, RRuleWithExcludedDates } from 'src/utilities';
import { AddLessonDto, DeleteLessonDto, GetLessonsDto, UpdateLessonDto } from '../../dto/request';
import { LessonListResponse, LessonResponse } from '../../dto/response';

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
                const lesson = await this.checkIfLessonExist(updateLessonDto.lessonId);

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
                        const { foundDate } = this.findDateInLesson(lesson, updateLessonDto.oldDate);
                        if (foundDate.date.getTime() > lesson.lastLessonEndsAt.getTime()) {
                            lesson.lastLessonEndsAt = new Date(foundDate.date.getTime() + foundDate.durationInMilliSeconds);
                        }
                        lesson.excludedDates.push(updateLessonDto.oldDate);

                        lesson.editedDates.push({
                            date: updateLessonDto.newDate ? updateLessonDto.newDate : updateLessonDto.oldDate,
                            durationInMilliSeconds: updateLessonDto.durationInMilliSeconds
                        });
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

    public async getLessonsBetweenDates(getLessonsDto: GetLessonsDto): Promise<LessonListResponse[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const lessons = await this.lessonRepository.getLessonsBetweenDates(getLessonsDto);
                const lessonsWithDates = this.mapLessonsToListResponse(lessons, getLessonsDto);
                resolve(lessonsWithDates);
            } catch (error) {
                this.logger.error(error);
                reject(error);
            }
        });
    }

    public async deleteLesson(deleteLessonDto: DeleteLessonDto): Promise<LessonResponse | string> {
        return new Promise(async (resolve, reject) => {
            try {
                const lesson = await this.checkIfLessonExist(deleteLessonDto.lessonId);
                const deletedLessonResponse = SuccessMessage.LessonDeletedSuccessfully;

                switch (deleteLessonDto.type) {
                    case LessonDeleteType.Single: {
                        if (lesson.recurrence === RecurrenceType.None) {
                            await this.lessonRepository.deleteLesson(lesson);
                            return resolve(deletedLessonResponse);
                        } else {
                            const { foundDate, lessonWithDate } = this.findDateInLesson(lesson, deleteLessonDto.dateToDelete);

                            if (foundDate.date.getTime() === lesson.lastLessonEndsAt.getTime()) {
                                lesson.lastLessonEndsAt = foundDate.date;

                            } else if (foundDate.date.getTime() === lesson.firstLessonStartsAt.getTime()) {
                                lesson.firstLessonStartsAt = lessonWithDate.occursAt[1].date;

                            } else {
                                lesson.excludedDates.push(deleteLessonDto.dateToDelete);
                            }
                        }
                        break;
                    }
                    case LessonDeleteType.Following: {
                        if (lesson.recurrence === RecurrenceType.None) {
                            throw new HttpException({ key: ErrorMessage.LessonNotExist }, HttpStatus.NOT_FOUND);
                        }
                        const { foundDate } = this.findDateInLesson(lesson, deleteLessonDto.dateToDelete);
                        lesson.lastLessonEndsAt = foundDate.date;
                        break;
                    }
                    case LessonDeleteType.All: {
                        await this.lessonRepository.deleteLesson(lesson);
                        return resolve(deletedLessonResponse);
                        break;
                    }
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

    private async checkIfLessonExist(lessonId: string): Promise<Lesson> {
        const lesson = await this.lessonRepository.getLessonById(lessonId);
        if (!lesson) {
            throw new HttpException({ key: ErrorMessage.LessonNotExist }, HttpStatus.NOT_FOUND);
        }
        return lesson;
    }

    private findDateInLesson(lesson: Lesson, date: Date): { foundDate: DateWithDurationInterface, lessonWithDate: Lesson } {
        const oldLessonWithDates = this.mapLessonDates(lesson);
        const foundDate = oldLessonWithDates.occursAt.find(
            old => old.date.toDateString() === date.toDateString());
        if (!foundDate) {
            throw new HttpException({ message: ErrorMessage.LessonNotAtThisDate }, HttpStatus.NOT_FOUND);
        }
        return { foundDate, lessonWithDate: oldLessonWithDates };
    }

    private mapLessonDates(lesson: Lesson, betweenDates?: BetweenDatesInterface): Lesson {
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
            if (betweenDates) {
                lesson.occursAt = rruleDates.getBetween(betweenDates);
            } else {
                lesson.occursAt = rruleDates.getAll();
            }
        }
        return lesson;
    }

    private mapLessonsToListResponse(lessons: Lesson[], betweenDates: BetweenDatesInterface): LessonListResponse[] {
        const lessonsListResponse: LessonListResponse[] = [];
        for (const lesson of lessons) {
            const lessonWithDates = this.mapLessonDates(lesson, betweenDates);
            for (const date of lessonWithDates.occursAt) {
                const lessonListResponse: LessonListResponse = {
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description,
                    recurrence: lesson.recurrence,
                    startsAt: date.date,
                    durationInMilliSeconds: date.durationInMilliSeconds
                };
                lessonsListResponse.push(lessonListResponse);
            }
        }
        return lessonsListResponse;
    }
}
