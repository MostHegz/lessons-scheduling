import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { RepeatedIntervals, RepeatedIntervalsSchema } from './repeated-intervals.schema';

@Schema({ timestamps: true })
export class Lesson extends Document {
    @Prop()
    userId: number;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ type: [RepeatedIntervalsSchema] })
    repeatedIntervals: RepeatedIntervals[];

    @Prop([Date])
    excludedDates: Date[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
