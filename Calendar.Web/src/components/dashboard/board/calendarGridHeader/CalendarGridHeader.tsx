import { useEffect, useState } from 'react';
import { useAppSelector } from '@store/storeHooks';
import { WeekDay } from '@custom-types/calendar-types';

import './CalendarGridHeader.scss';

const CalendarGridHeader: React.FC = () => {

    const selectedWeekList = useAppSelector(state => state.calendarPicker.selectedWeekList) ?? [];
    const [weekList, setWeekList] = useState<WeekDay[]>(selectedWeekList ?? []);

    useEffect(() => {
        setWeekList([...selectedWeekList]);
    }, [selectedWeekList]);

    return (<>
                <div className='grid-header'>
                    <div></div>
                    { weekList?.length > 0 && weekList.map((weekDay: WeekDay, index: number) => {
                        return <div key={`header_day_${index}`} className='grid-column'>
                                    <div className='day-num fs-3'>{weekDay.day}</div>
                                    <div className='day-label'>{weekDay.dayLabel}</div>
                                </div>
                    }) }
                </div>
            </>)
}

export default CalendarGridHeader;