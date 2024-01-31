export interface CurrentDateTime {
    day: number,
    hour: number,
    minute: number
}

export interface EventPosition {
    row: number,
    column: number
}

export interface Event {
    eventId: string,
    title: string,
    notes: string,
    color: string,
    startTime: string,
    endTime: string,
    eventDate: string,
    createdDate: string,
    modifiedDate: string
}

export interface EventCommand {
    title: string,
    notes: string,
    color: string,
    startTime: string,
    endTime: string,
    eventDate: string
}

export interface EventBoard {
    event: Event | null,
    indexBoard: number, 
    gridStart: string,
    gridEnd: string,
    gridColumn?: number,
    isSpanRow: boolean,
}

export interface WeekDay {
    day: number,
    date: string,
    dayLabel: string
}

export interface WeekDaysCalendar {
    daysWeekList: Array<WeekDay>
    setDaysWeekList: (date: string) => Array<WeekDay>
}