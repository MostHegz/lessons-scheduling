import { Body, Controller, Logger, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Constants } from 'src/common';
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

}
