import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constants, MappedDays, RecurrenceType } from 'src/common';
import { Lesson } from './data/lessons.schema';
import { RepeatedIntervals } from './data/repeated-intervals.schema';
import { AddLessonDto } from './dto/request';
import { LessonsRepository } from './lessons.repository';
import { RepeatedIntervalsInterface } from 'src/interface';


@Injectable()
export class LessonsService {
    private logger = new Logger('LessonsService');
    constructor(
        private readonly lessonsRepository: LessonsRepository,
        @InjectModel(RepeatedIntervals.name)
        private repeatedIntervalModel: Model<RepeatedIntervals>
    ) { }

    async addLesson(addLessonDto: AddLessonDto): Promise<Lesson> {
        return new Promise(async (resolve, reject) => {
            try {
                const repeatedIntervals: RepeatedIntervals[] = [];
                // TODO: get user id from token

                if (addLessonDto.recurrence === RecurrenceType.Daily) {
                    const dailyInterval: RepeatedIntervalsInterface = {
                        start: addLessonDto.startAt,
                        end: addLessonDto.recurrenceEndAt,
                        durationInMilliSeconds: addLessonDto.durationInMilliSeconds,
                        interval: Constants.DAY_TIME_INTERVAL
                    };
                    repeatedIntervals.push(new this.repeatedIntervalModel(dailyInterval));
                }

                if (addLessonDto.recurrence === RecurrenceType.Weekly) {
                    const startHour = addLessonDto.startAt.getHours();
                    const startMinute = addLessonDto.startAt.getMinutes();
                    for (const day of addLessonDto.days) {
                        const dayIndex = MappedDays[day];
                        const startDate = addLessonDto.startAt;
                        startDate.setDate(startDate.getDate() + ((dayIndex + 7 - startDate.getDay()) % 7));
                        startDate.setHours(startHour);
                        startDate.setMinutes(startMinute);

                        const weeklyInterval: RepeatedIntervalsInterface = {
                            start: addLessonDto.startAt,
                            end: addLessonDto.recurrenceEndAt,
                            durationInMilliSeconds: addLessonDto.durationInMilliSeconds,
                            interval: Constants.WEEK_TIME_INTERVAL
                        };
                        repeatedIntervals.push(new this.repeatedIntervalModel(weeklyInterval));
                    }

                }

                if (addLessonDto.recurrence === RecurrenceType.None) {
                    const recurrenceEndAt = new Date(addLessonDto.startAt.getTime() + addLessonDto.durationInMilliSeconds);
                    const interval: RepeatedIntervalsInterface = {
                        start: addLessonDto.startAt,
                        end: recurrenceEndAt,
                        durationInMilliSeconds: addLessonDto.durationInMilliSeconds,
                        interval: 0
                    };
                    repeatedIntervals.push(new this.repeatedIntervalModel(interval));
                }
                const addedLesson = await this.lessonsRepository.addLesson(addLessonDto, repeatedIntervals);
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

    async findAll(): Promise<Lesson[]> {
        return this.lessonsRepository.findAll();
    }

}
