import { RecurrenceType } from 'src/data/enum';

export interface ExpandedLessonsInterface {
    id: string;
    title: string;
    description: string;
    recurrence: RecurrenceType;
    startsAt: Date;
    durationInMilliSeconds: number;
}
