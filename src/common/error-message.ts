export enum ErrorMessage {
    UserRequired = 'User is required',
    TitleRequired = 'Title is required',
    DescriptionRequired = 'Description is required',
    LessonStartRequired = 'Lesson start is required',
    LessonEndRequired = 'Lesson end is required',
    LessonEndAfterStart = 'Lesson end must be after its start',
    LessonExistsAtThisTime = 'There is an existing lesson at this time',
    InvalidRecurrenceInput = 'Invalid recurrence',
    RecurrenceDaysRequired = 'Recurrence days are required',
    RecurrenceEndRequired = 'Recurrence end is required',
    RecurrenceEndAfterEnd = 'Recurrence end must be after end date',
    DurationRequired = 'Duration is required',
}
