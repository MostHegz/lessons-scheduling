import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RepeatedIntervals, RepeatedIntervalsSchema } from './repeated-intervals.schema';

@Schema({ timestamps: true })
export class Lesson extends Document {
    @Prop({ required: true })
    userId: number;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    startAt: Date;

    @Prop({ required: true })
    endAt: Date;

    @Prop({ default: false })
    isRepeated: boolean;

    @Prop({ type: [RepeatedIntervalsSchema] })
    repeatedIntervals: RepeatedIntervals[];

    @Prop([Date])
    excludedDates: Date[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
