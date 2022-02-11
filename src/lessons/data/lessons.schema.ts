import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Days, RecurrenceType } from 'src/common';
import { DateWithDurationInterface } from 'src/interface';
import { EditedDate, EditedDateSchema } from './edited-date.schema';

@Schema({ timestamps: true })
export class Lesson extends Document {

    @Prop({ required: true })
    userId: number;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, })
    firstLessonStartsAt: Date;

    @Prop({ default: null })
    lastLessonEndsAt: Date;

    @Prop({ required: true })
    recurrence: RecurrenceType;

    @Prop({ type: [String], enum: Days })
    recurrenceDays: Days[];

    @Prop({ required: true })
    durationInMilliSeconds: number;

    @Prop({ type: [EditedDateSchema] })
    editedDates: EditedDate[];

    @Prop([Date])
    excludedDates: Date[];

    occursAt: DateWithDurationInterface[] = [];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
