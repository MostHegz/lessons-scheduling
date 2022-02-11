import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class DateExclusion {
    @Prop({ required: true })
    oldDate: Date;

    @Prop({ required: true })
    newDate: Date;

    @Prop({ required: false })
    durationInMilliSeconds: number;
}

export const DateExclusionSchema = SchemaFactory.createForClass(DateExclusion);
