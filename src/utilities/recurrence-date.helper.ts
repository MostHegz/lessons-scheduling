import { Constants } from 'src/common';
import { Days, MappedDays, RecurrenceType } from 'src/data/enum';
import { EditedDate } from 'src/data/model';
import { BetweenDatesInterface, DateWithDurationInterface } from 'src/interface';

export class RecurrenceDate {

    constructor(
        private dateStart: Date,
        private until: Date,
        private editedDates: EditedDate[],
        private excludedDates: Date[],
        private durationInMilliSeconds: number,
        private days?: Days[],
        private recurrence?: RecurrenceType,
    ) {

    }

    public getDates(betweenDates?: BetweenDatesInterface): DateWithDurationInterface[] {
        const dates: DateWithDurationInterface[] = [];

        const startDate = betweenDates?.from && betweenDates.from > this.dateStart ? betweenDates.from : this.dateStart;
        const endDate = betweenDates?.to && betweenDates.to < this.until ? betweenDates.to : this.until;

        switch (this.recurrence) {
            case RecurrenceType.None: {
                const date: DateWithDurationInterface = {
                    date: this.dateStart,
                    durationInMilliSeconds: this.durationInMilliSeconds
                };
                dates.push(date);
                break;
            }

            case RecurrenceType.Daily: {
                const datesWithDurations = this.addDaysToDate(1, startDate, endDate);
                dates.push(...datesWithDurations);
                const filteredEditedDates = this.getDatesBetween(this.editedDates, startDate, endDate);
                dates.push(...filteredEditedDates);
                break;
            }

            case RecurrenceType.Weekly: {
                for (const day of this.days) {
                    const dayIndex = MappedDays[day];
                    const startDateTimestamp = startDate.setUTCDate(startDate.getUTCDate() + ((dayIndex + 7 - startDate.getUTCDay()) % 7));
                    const date = new Date(startDateTimestamp);
                    const datesWithDurations = this.addDaysToDate(7, date, endDate);
                    dates.push(...datesWithDurations);
                }
                const filteredEditedDates = this.getDatesBetween(this.editedDates, startDate, endDate);
                dates.push(...filteredEditedDates);
                break;
            }
        }

        const sortedDates = dates.sort((a, b) => a.date.getTime() - b.date.getTime());

        return sortedDates;
    }

    private addDaysToDate(numberOfDays: number, date: Date, until: Date): DateWithDurationInterface[] {
        const datesWitDurations: DateWithDurationInterface[] = [];
        const result = new Date(date);
        while (result.getTime() < until.getTime() - numberOfDays * Constants.DAY_TIME_INTERVAL) {
            result.setDate(result.getDate() + numberOfDays);
            const foundExcludedDate = this.excludedDates.find(excludedDate => excludedDate.getTime() === result.getTime());
            if (!foundExcludedDate) {
                const dateWithDuration: DateWithDurationInterface = {
                    date: new Date(result),
                    durationInMilliSeconds: this.durationInMilliSeconds
                };
                datesWitDurations.push(dateWithDuration);
            }
        }
        return datesWitDurations;
    }

    private getDatesBetween(dates: DateWithDurationInterface[], startDate: Date, endDate: Date): DateWithDurationInterface[] {
        const filteredDates: DateWithDurationInterface[] = [];
        for (const date of dates) {
            if (date.date.getTime() >= startDate.getTime() && date.date.getTime() <= endDate.getTime()) {
                filteredDates.push(date);
            }
        }
        return filteredDates;
    }
}
