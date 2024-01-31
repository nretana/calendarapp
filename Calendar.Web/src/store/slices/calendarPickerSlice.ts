
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeekDay } from '@custom-types/calendar-types';
import { getDaysOfWeek } from '@utils/calendar-utils';
import { format } from 'date-fns';
import { dateConfig } from '@config/date-config';

interface CalendarState {
    selectedDate: string,
    selectedWeekList: WeekDay[]
}

const initialState: CalendarState = {
    selectedDate: format(Date.now(), dateConfig.isoDateFormat),
    selectedWeekList: getDaysOfWeek(format(Date.now(), dateConfig.isoDateFormat), 'short', dateConfig.locale)
}

const calendarPickerSlice = createSlice({
    name: 'calendarPicker',
    initialState,
    reducers: {
        SelectDate: (state, action: PayloadAction<{ date: string, weekList: (WeekDay[] | null) }>) => {
            state.selectedDate = action.payload.date;
            const weekList = action.payload.weekList;
            if(weekList !== null){
                state.selectedWeekList = weekList;
            }
        }
    }
});

export const calendarActions = calendarPickerSlice.actions;
export default calendarPickerSlice;