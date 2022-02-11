import { Body, Controller, InternalServerErrorException, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { resolve } from 'path';
import { SuccessMessage, Constants, RecurrenceType, RecurrenceTypeMapper } from 'src/common';
import { MapperHelper } from 'src/utilities';
import { RRuleWithExcludedDates } from 'src/utilities/rrule-with-excluded-dates.class';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto } from './dto/request';
import { LessonResponse } from './dto/response';
import { LessonsService } from './lessons.service';


@ApiBearerAuth(Constants.API_AUTH_NAME)
@Controller(Constants.LESSON)
export class LessonsController {

    private logger = new Logger('LessonsController');
    constructor(private lessonsService: LessonsService) { }

    @Post(`${Constants.ADD_PATH}`)
    @ApiOperation({ summary: 'Add lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Added', type: Lesson })
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

            if (addedLesson.recurrence === RecurrenceType.None) {
                addedLesson.occursAt = [{
                    date: addedLesson.firstLessonStartsAt,
                    durationInMilliSeconds: addedLesson.durationInMilliSeconds
                }];
            } else {
                const rruleDates = new RRuleWithExcludedDates(
                    addedLesson.firstLessonStartsAt,
                    addedLesson.lastLessonEndsAt,
                    addedLesson.editedDates,
                    addedLesson.excludedDates,
                    addedLesson.durationInMilliSeconds,
                    addedLesson.recurrenceDays,
                    addLessonDto.recurrence
                );

                addedLesson.occursAt = rruleDates.getAll();
            }

            const response = MapperHelper.toClient(LessonResponse, addedLesson);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }


}
