import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RepeatedIntervalsInterface } from 'src/interface';

@Schema({ _id: false, timestamps: false })
export class RepeatedIntervals extends Document implements RepeatedIntervalsInterface {
    @Prop({ required: true })
    start: Date;

    @Prop({ required: true })
    durationInMilliSeconds: number;

    @Prop()
    end: Date;

    @Prop({ default: 0 })
    interval: number;
}

export const RepeatedIntervalsSchema = SchemaFactory.createForClass(RepeatedIntervals);
