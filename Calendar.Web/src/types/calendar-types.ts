export type CurrentDateTime = {
    day: number,
    hour: number,
    minute: number
}

export type EventPosition = {
    row: number,
    column: number
}

export type Event = {
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

export type EventCommand = {
    title: string,
    notes: string,
    color: string,
    startTime: string,
    endTime: string,
    eventDate: string
}

export type EventBoard = {
    event: Event | null,
    indexBoard: number, 
    gridStart: string,
    gridEnd: string,
    gridColumn?: number,
    isSpanRow: boolean,
    isSelected?: boolean
}

export type WeekDay = {
    day: number,
    date: string,
    dayLabel: string
}

export type WeekDaysCalendar = {
    daysWeekList: Array<WeekDay>
    setDaysWeekList: (date: string) => Array<WeekDay>
}