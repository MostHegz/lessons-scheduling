import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Logger, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Constants, ErrorMessage, LessonUpdateType, RecurrenceType } from 'src/common';
import { MapperHelper } from 'src/utilities';
import { RRuleWithExcludedDates } from 'src/utilities/rrule-with-excluded-dates.class';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto, UpdateLessonDto } from './dto/request';
import { LessonResponse } from './dto/response';
import { LessonsService } from './lessons.service';


@ApiBearerAuth(Constants.API_AUTH_NAME)
@Controller(Constants.LESSON)
export class LessonsController {

    private logger = new Logger('LessonsController');
    constructor(private lessonsService: LessonsService) { }

    @Post(`${Constants.ADD_PATH}`)
    @ApiOperation({ summary: 'Add lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Added', type: LessonResponse })
    async addShop(@Body() addLessonDto: AddLessonDto): Promise<LessonResponse> {
        try {
            // TODO: get user id from token instead of request body
            if (addLessonDto.recurrence !== RecurrenceType.Weekly) {
                addLessonDto.recurrenceDays = [];
            }

            if (addLessonDto.recurrence === RecurrenceType.None) {
                const firstLessonStartsAt = addLessonDto.firstLessonStartsAt.getTime();
                addLessonDto.lastLessonEndsAt = new Date(firstLessonStartsAt + addLessonDto.durationInMilliSeconds);
            }

            const addedLesson = await this.lessonsService.addLesson(addLessonDto);
            const lessonWithDates = this.lessonsService.mapLessonDates(addedLesson);
            const response = MapperHelper.toClient(LessonResponse, lessonWithDates);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    @Put(`${Constants.UPDATE_PATH}`)
    @ApiOperation({ summary: 'Update lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Updated', type: LessonResponse })
    async updateLesson(@Body() updateLessonDto: UpdateLessonDto): Promise<any> {
        try {
            // TODO: get user from token and add it to the get lesson query
            const lesson = await this.lessonsService.getLessonById(updateLessonDto.lessonId);
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
                    const oldLessonWithDates = this.lessonsService.mapLessonDates(lesson);
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
            const updatedLesson = await this.lessonsService.updateLesson(lesson);
            const lessonWithDates = this.lessonsService.mapLessonDates(updatedLesson);
            const response = MapperHelper.toClient(LessonResponse, lessonWithDates);
            return response;
        } catch (error) {
            this.logger.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException();
        }
    }

}
