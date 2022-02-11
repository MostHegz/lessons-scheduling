import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, ValidateIf } from 'class-validator';
import { ErrorMessage, LessonDeleteType } from 'src/common';

export class DeleteLessonDto {

    @ApiProperty({
        example: '6206309fc5fdf5dcca42fc95',
        description: 'user id',
        required: true
    })
    @IsMongoId({ message: ErrorMessage.LessonRequired })
    public lessonId: string;

    @ApiProperty({
        example: LessonDeleteType.Single,
        enum: LessonDeleteType,
        required: true
    })
    @IsEnum(LessonDeleteType)
    public type: LessonDeleteType;

    @ApiProperty({
        example: '2022-01-30T13:00:00.000Z',
        description: 'If editing a single recurrence date send the old date before',
        required: true
    })
    @ValidateIf(input => input.type !== LessonDeleteType.All)
    @IsDate({ message: ErrorMessage.DateToDeleteRequired })
    @Type(() => Date)
    public dateToDelete: Date;
}
