import RRule, { Frequency } from 'rrule';
import { Days, RecurrenceType, RecurrenceTypeMapper } from 'src/common';
import { DateWithDurationInterface } from 'src/interface';
import { DateExclusion } from 'src/lessons/data/exclusion-date.schema';

export class RRuleWithExcludedDates extends RRule {

    constructor(
        private dtstart: Date,
        private until: Date,
        private excludedDates: DateExclusion[],
        private durationInMilliSeconds: number,
        private byweekday?: Days[],
        private recurrence?: RecurrenceType,
    ) {
        super(
            {
                byweekday,
                dtstart,
                until,
                freq: +RecurrenceTypeMapper[recurrence],
            }
        );
    }

    public betweenWithExcluded(startAt: Date, endAt: Date): DateWithDurationInterface[] {
        const dates = this.between(startAt, endAt);
        const datesWithDurations = this.mapDates(dates);
        return datesWithDurations;
    }

    public getAll(): DateWithDurationInterface[] {
        const dates = this.all();
        const datesWithDurations = this.mapDates(dates);
        return datesWithDurations;
    }

    private mapDates(dates: Date[]): DateWithDurationInterface[] {
        const datesWithDurations: DateWithDurationInterface[] = [];
        for (const date of dates) {
            const excludedDate = this.excludedDates.find(d => d.oldDate === date);
            if (excludedDate) {
                const dateWithDuration: DateWithDurationInterface = {
                    date: excludedDate.newDate,
                    durationInMilliSeconds: excludedDate.durationInMilliSeconds
                };
                datesWithDurations.push(dateWithDuration);
            } else {
                const dateWithDuration: DateWithDurationInterface = {
                    date,
                    durationInMilliSeconds: this.durationInMilliSeconds
                };
                datesWithDurations.push(dateWithDuration);
            }
        }
        return datesWithDurations;
    }
}
