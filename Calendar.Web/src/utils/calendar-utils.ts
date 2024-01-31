import { parseDate, parseTime, Time } from '@internationalized/date'
import { addDays, addHours, addMinutes, areIntervalsOverlapping, format, startOfWeek } from 'date-fns';
import { Event, WeekDay } from '@custom-types/calendar-types';
import { dateConfig } from '@config/date-config';


/** create a Time object. If string is not a valid date, you can set default values for hour and miniute */
export const getTimeObject = (value: (string | undefined), defaultHour : number, defaultMinute: number = 0) : Time => {
    if(typeof value !== 'string'){
        return new Time(defaultHour <= 23 ? defaultHour : 0, defaultMinute);
    } 
    
    const currentTime = parseTime(value);
    if(currentTime.hour === 24){
        currentTime.set({ hour: 0 });
    }
    return new Time(currentTime.hour, currentTime.minute);
};

 /** Calculate hour and min differences between start date and end date */
export const getDiffTime = (startTime: string, endTime: string) : Time => {
    const startTimeVal = parseTime(startTime);
    const endTimeVal = parseTime(endTime);

    let diffHour = ((endTimeVal.hour - startTimeVal.hour) * 60) / 60;
    let diffMinutes = Math.abs(endTimeVal.minute - startTimeVal.minute);

    if(diffHour === 1 && startTimeVal.minute > 0 && diffMinutes > 0){
        diffHour = diffHour - 1;
        diffMinutes = 60 - diffMinutes;
    }

    return new Time(diffHour, diffMinutes);
}

export const getIndexByTime = (timeStr: string | undefined) : number => {
    if (typeof timeStr !== 'string') {
        return 0;
    }

    const time = parseTime(timeStr);
    const hour = time?.hour;
    const minutes = time?.minute / 15;

    //current index in array is the sum of the hour + 1 (index starts with 0)
    //and the number of minutes in quarters.
    const index = (hour + minutes);
    return index;
}

export const getGridPosition = (eventTime: string | undefined) : number => {
    if(typeof eventTime !== 'string' || eventTime === undefined) return 0;

    const time = parseTime(eventTime);
    const hour = time?.hour;
    const minutes = time?.minute / 15;
    
    const gridStartIndex = Array.from<number>({ length: hour })
                                .fill(4).reduce((accum: number, value: number) => accum = accum + value, 0);
    return (gridStartIndex + minutes) + 1;
}

export const getDatesByWeekList = (date: string, weekList: WeekDay[]): string[] =>{

    const currentDate = parseDate(date);
    const res = weekList.map(w => currentDate.set({ day: w.day }).toString());
    const dateArr: string[]= [...res];
    return dateArr;
}

export const getDaysOfWeek = (selectedDate: string, weekDayStyle: ('narrow' | 'short' | 'long'), locale: string ): WeekDay[] => {
    const currentDate = new Date(selectedDate);
    //convert to UTC date
    const initOfWeek = startOfWeek(new Date(currentDate.getUTCFullYear(), 
                                            currentDate.getUTCMonth(), 
                                            currentDate.getUTCDate()), { weekStartsOn: 0 });
    const weekList: WeekDay[] = []; 

    for (let i = 0; i < 7; i++){
        const date = addDays(initOfWeek, i);
        const dateFormatted = format(date, dateConfig.isoDateFormat);
        const WeekdayFormatted = new Intl.DateTimeFormat(locale, { weekday: weekDayStyle }).format(date);
        const weekDay: WeekDay = {
            day: date.getDate(),
            date: dateFormatted,
            dayLabel: WeekdayFormatted
        }

        weekList.push(weekDay);
    }

    return weekList;
}

export const getScrollTopPosition = (contentHeight: number, contentScrollHeight: number) : number => {

    const currentDateTime = new Date();
    const hour = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();

    const scrollHeight = contentScrollHeight - contentHeight;
    const cellHeight = scrollHeight / 24;
    const currentHourHeight = hour * cellHeight;
    const currentMinuteHeight = (minutes / 60) * cellHeight;
    return currentHourHeight + currentMinuteHeight;
}

export const isValidTimeRange  = (startTime: Time, endTime: Time) => {

    if(startTime === null || endTime === null){
        throw new Error('Invalid time range');
    }

    if((startTime.hour === 23) && (endTime.hour === 0 && endTime.minute === 0)){
        return true;
    }
    return startTime.compare(endTime) < 0;
}

export const isAvailableTime = (currentDate: Date, startTime: Time, endTime: Time, weeklyEventList: Event[]) : boolean => {

    const eventsBytDate = weeklyEventList.filter(event => {
            const eventDateFormatted = format(new Date(event.eventDate), dateConfig.isoDateFormat)
            const currentDateFormatted = format(currentDate, dateConfig.isoDateFormat);
           return eventDateFormatted === currentDateFormatted;
    });

    if(eventsBytDate === undefined || eventsBytDate.length === 0){
        return true;
    }
 
    const currentDateWithStartTime = addHours(addMinutes(currentDate, startTime.minute), startTime.hour);
    const currentDateWithEndTime = addHours(addMinutes(currentDate, endTime.minute), endTime.hour);
    
    const isValidTime = eventsBytDate.every(event => {
        const eventStartTime = parseTime(event.startTime);
        const eventEndTime = parseTime(event.endTime);

        //event start and end time ranges
        const eventDateWithStartTime = addHours(addMinutes(new Date(event.eventDate), eventStartTime.minute), eventStartTime.hour);
        const eventDateWithEndTime = addHours(addMinutes(new Date(event.eventDate), eventEndTime.minute), eventEndTime.hour);

        const isTimeOverlapped = areIntervalsOverlapping({ start: currentDateWithStartTime, end: currentDateWithEndTime },
                                                         { start: eventDateWithStartTime, end: eventDateWithEndTime });
        return !isTimeOverlapped;
    });

    return isValidTime;
}
