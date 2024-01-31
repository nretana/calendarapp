import { parseDate, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { format } from 'date-fns';
import { getDaysOfWeek } from '@utils/calendar-utils';
import { useAppDispatch, useAppSelector } from '@store/storeHooks';
import { calendarActions } from '@store/slices/calendarPickerSlice';
import { WeekDay } from '@custom-types/calendar-types';

import Calendar from '../../core/Calendar';

import './CalendarPicker.scss';

const CalendarPicker : React.FC = () => {
    
    const dispatch = useAppDispatch();
    const selectedDate = useAppSelector(state => state.calendarPicker.selectedDate);
    const selectedWeekList = useAppSelector(state => state.calendarPicker.selectedWeekList);
    
    const currentCalendarDate = parseDate(selectedDate);

    const onSelectDataHandler = (value: CalendarDate) => {
        const currentDate = format(value.toDate(getLocalTimeZone()), 'yyyy-MM-dd');
        const isSameWeek = selectedWeekList.findIndex((weekDay: WeekDay) => weekDay.date === currentDate);
        const weekList = isSameWeek === -1 ? getDaysOfWeek(currentDate, 'short', 'en-us') : null;
        dispatch(calendarActions.SelectDate({ date: value.toString(), weekList}));
    }
    
    return(
        <div className='container-calendar-picker'>
           <Calendar value={currentCalendarDate}
                     onChange={(value: CalendarDate) => onSelectDataHandler(value)} />
        </div>
    )
}

export default CalendarPicker;