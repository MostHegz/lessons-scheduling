import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { RecurrenceType } from 'src/data/enum';
import { ExpandedLessonsInterface } from 'src/interface';
import { DateResponse } from './date.response';

export class LessonListResponse implements ExpandedLessonsInterface {
    @ApiProperty({
        example: '62061cd44a30a7c3216516bd',
        description: 'lesson id',
        required: true
    })
    @Expose()
    @Transform(({ obj }) => obj?._id)
    public id: string;

    @ApiProperty({
        example: 'Lesson title',
        description: 'lesson title',
        required: true
    })
    @Expose()
    public title: string;

    @ApiProperty({
        example: 'Lesson description',
        description: 'lesson description',
        required: true
    })
    @Expose()
    public description: string;

    @ApiProperty({
        example: RecurrenceType.Daily,
        description: 'lesson recurrence',
        required: true,
        enum: RecurrenceType
    })
    @Expose()
    public recurrence: RecurrenceType;

    @ApiProperty({
        type: Date,
        description: 'lesson starts at this time',
        required: true
    })
    @Expose()
    @Type(() => DateResponse)
    public startsAt: Date;

    @ApiProperty({
        example: 360000,
        description: 'lesson duration',
        required: true
    })
    @Expose()
    public durationInMilliSeconds: number;
}
