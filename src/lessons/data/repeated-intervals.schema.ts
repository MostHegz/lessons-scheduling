import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class RepeatedIntervals extends Document {
    @Prop()
    start: Date;

    @Prop()
    end: Date;

    @Prop()
    interval: number;
}

export const RepeatedIntervalsSchema = SchemaFactory.createForClass(RepeatedIntervals);
