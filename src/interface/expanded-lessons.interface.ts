import { RecurrenceType } from 'src/common';

export interface ExpandedLessonsInterface {
    id: string;
    title: string;
    description: string;
    recurrence: RecurrenceType;
    startsAt: Date;
    durationInMilliSeconds: number;
}
