import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { DateWithDurationInterface } from 'src/interface';

@Schema({ _id: false, timestamps: false })
export class EditedDate implements DateWithDurationInterface {
    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    durationInMilliSeconds: number;
}

export const EditedDateSchema = SchemaFactory.createForClass(EditedDate);
