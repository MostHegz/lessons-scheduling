import { Body, Controller, InternalServerErrorException, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessMessage, Constants } from 'src/common';
import { Lesson } from './data/lessons.schema';
import { AddLessonDto } from './dto/request';
import { LessonsService } from './lessons.service';


@ApiBearerAuth(Constants.API_AUTH_NAME)
@Controller(Constants.LESSON)
export class LessonsController {

    private logger = new Logger('AuthController');
    constructor(private lessonsService: LessonsService) { }

    @Post(`${Constants.ADD_PATH}`)
    @ApiOperation({ summary: 'Add lesson', tags: [Constants.LESSON] })
    @ApiResponse({ status: 200, description: 'Lesson Added', type: Lesson })
    addShop(@Body() addLessonDto: AddLessonDto): Promise<Lesson> {
        try {
            // TODO: get user id from token instead of request body
            return this.lessonsService.addLesson(addLessonDto);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }


}
