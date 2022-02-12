import { Body, Controller, Delete, Get, Logger, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Constants } from 'src/common';
import { JwtPayloadInterface } from 'src/interface';
import { GetToken } from 'src/utilities';
import { AddLessonDto, DeleteLessonDto, GetLessonsDto, UpdateLessonDto } from '../../dto/request';
import { LessonListResponse, LessonResponse } from '../../dto/response';
import { LessonsService } from './lessons.service';


@ApiBearerAuth(Constants.API_AUTH_NAME)
@Controller(Constants.LESSON)
export class LessonsController {

    private logger = new Logger('LessonsController');
    constructor(private lessonsService: LessonsService) { }

    @Post(`${Constants.ADD_PATH}`)
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Add lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Added', type: LessonResponse })
    async addShop(@Body() addLessonDto: AddLessonDto, @GetToken() token: JwtPayloadInterface): Promise<LessonResponse> {
        try {
            return this.lessonsService.addLesson(addLessonDto, token);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Put(`${Constants.UPDATE_PATH}`)
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Update lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Updated', type: LessonResponse })
    async updateLesson(@Body() updateLessonDto: UpdateLessonDto, @GetToken() token: JwtPayloadInterface): Promise<LessonResponse> {
        try {
            return this.lessonsService.updateLesson(updateLessonDto, token);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Delete(`${Constants.DELETE_PATH}`)
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Delete lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Deleted', type: LessonResponse })
    async deleteLesson(@Body() deleteLessonDto: DeleteLessonDto, @GetToken() token: JwtPayloadInterface): Promise<LessonResponse | string> {
        try {
            return this.lessonsService.deleteLesson(deleteLessonDto, token);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(`${Constants.LESSONS}`)
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'get lessons between dates', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Retrieved', type: [LessonListResponse] })
    async getLessonsBetweenDates(@Query() getLessonsDto: GetLessonsDto, @GetToken() token: JwtPayloadInterface): Promise<LessonListResponse[]> {
        try {
            return this.lessonsService.getLessonsBetweenDates(getLessonsDto, token);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }


}
