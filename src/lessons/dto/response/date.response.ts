import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DateResponse {
    @ApiProperty({
        example: '2022-02-28T14:00:00.000Z',
        description: 'date',
        required: true
    })
    @Expose()
    public date: Date;

    @ApiProperty({
        example: 36000000,
        description: 'duration',
        required: true
    })
    @Expose()
    public durationInMilliSeconds: number;
}
