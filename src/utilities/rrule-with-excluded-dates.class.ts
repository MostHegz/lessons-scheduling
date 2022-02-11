import { RRule, RRuleSet } from 'rrule';
import { Days, RecurrenceType, RecurrenceTypeMapper } from 'src/common';
import { BetweenDatesInterface, DateWithDurationInterface, ExpandedLessonsInterface } from 'src/interface';
import { EditedDate } from 'src/lessons/data/edited-date.schema';

export class RRuleWithExcludedDates extends RRuleSet {

    constructor(
        dtstart: Date,
        private until: Date,
        private editedDates: EditedDate[],
        private excludedDates: Date[],
        private durationInMilliSeconds: number,
        private byweekday?: Days[],
        private recurrence?: RecurrenceType,
    ) {
        super();
        this.rrule(new RRule(
            {
                byweekday,
                dtstart,
                until,
                freq: +RecurrenceTypeMapper[recurrence],
            })
        );
        for (const date of this.excludedDates) {
            this.exdate(date);
        }
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

    public getBetween(betweenDates: BetweenDatesInterface): DateWithDurationInterface[] {
        const dates = this.between(betweenDates.from, betweenDates.to);
        const datesWithDurations = this.mapDates(dates, betweenDates);
        return datesWithDurations;
    }

    private mapDates(dates: Date[], betweenDates?: BetweenDatesInterface): DateWithDurationInterface[] {
        const datesWithDurations: DateWithDurationInterface[] = [];
        for (const date of dates) {
            const dateWithDuration: DateWithDurationInterface = {
                date,
                durationInMilliSeconds: this.durationInMilliSeconds
            };
            datesWithDurations.push(dateWithDuration);
        }
        for (const date of this.editedDates) {
            const dateTimeStamp = date.date.getTime();
            if (!betweenDates
                || (dateTimeStamp > betweenDates.from.getTime()
                    && dateTimeStamp < betweenDates.to.getTime())) {
                datesWithDurations.push(date);
            }
        }
        return datesWithDurations;
    }
}
