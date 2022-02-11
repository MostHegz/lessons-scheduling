import { Body, Controller, Delete, Get, Logger, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Constants } from 'src/common';
import { AddLessonDto, DeleteLessonDto, GetLessonsDto, UpdateLessonDto } from './dto/request';
import { LessonListResponse, LessonResponse } from './dto/response';
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
            // TODO: get from user token
            return this.lessonsService.addLesson(addLessonDto);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Put(`${Constants.UPDATE_PATH}`)
    @ApiOperation({ summary: 'Update lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Updated', type: LessonResponse })
    async updateLesson(@Body() updateLessonDto: UpdateLessonDto): Promise<LessonResponse> {
        try {
            // TODO: get user from token and add it to the get lesson query
            return this.lessonsService.updateLesson(updateLessonDto);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Delete(`${Constants.DELETE_PATH}`)
    @ApiOperation({ summary: 'Delete lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Deleted', type: LessonResponse })
    async deleteLesson(@Body() deleteLessonDto: DeleteLessonDto): Promise<LessonResponse | string> {
        try {
            // TODO: get user from token and add it to the get lesson query
            return this.lessonsService.deleteLesson(deleteLessonDto);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(`${Constants.LESSONS}`)
    @ApiOperation({ summary: 'get lessons between dates', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Retrieved', type: [LessonListResponse] })
    async getLessonsBetweenDates(@Query() getLessonsDto: GetLessonsDto): Promise<LessonListResponse[]> {
        try {
            // TODO: get user from token and add it to the get lesson query
            return this.lessonsService.getLessonsBetweenDates(getLessonsDto);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }


}
