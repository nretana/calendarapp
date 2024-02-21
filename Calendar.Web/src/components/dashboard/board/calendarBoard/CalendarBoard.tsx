import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@store/storeHooks';
import { CurrentDateTime, Event, EventPosition } from '@custom-types/calendar-types';
import { getScrollTopPosition } from '@utils/calendar-utils';

import AddCalendarEvent from '../../events/addCalendarEvent/AddCalendarEvent';
import Alert from 'react-bootstrap/Alert';
import CalendarBoardHeader from '../calendarBoardHeader/CalendarBoardHeader';
import CalendarEventList from '../calendarEventList/CalendarEventList';
import CalendarGrid from '../calendarGrid/CalendarGrid';
import CalendarGridHeader from '../calendarGridHeader/CalendarGridHeader';

import './CalendarBoard.scss';


const initCurrentDateTime = {
    day: 1,
    hour: 1,
    minute: 1
};

const initCurrentPosition = {
    row: 0,
    column: 0
};

const CalendarBoard: React.FC = () => {
    
    const selectetdDate = useAppSelector(state => state.calendarPicker.selectedDate);
    const isErrorEventBoard = useAppSelector(state => state.weeklyCalendarBoard.isErrorEventBoard);
    const [isShowEvent, setIsShowEvent] = useState<boolean>(false);
    const [currentDateTime, setCurrentDateTime] = useState<CurrentDateTime>(initCurrentDateTime);
    const [currentEvent, setCurrentEvent] = useState<Event | null | undefined>();
    const [currentEventPosition, setCurrentEventPosition] = useState<EventPosition>(initCurrentPosition);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(boardRef.current !== null) {
            const clientHeight  = boardRef.current.clientHeight;
            const scrollHeight = boardRef.current.scrollHeight;
            const currentScrollPosition = getScrollTopPosition(clientHeight, scrollHeight);
            boardRef.current.scrollTo({ top: currentScrollPosition, left: 0, behavior: 'smooth' });
        }
    }, [selectetdDate])

    return(
        <>
        <div className='container-calendar-board bg-white rounded-end'>
            <div className='container-calendar-wrapper'>
                <div className='calendar-board-fixed'>
                    <CalendarBoardHeader />
                </div>
                { (isErrorEventBoard) && 
                    <Alert variant='danger' className='mb-3'>
                        <p className='mb-0'>There was an error trying to retrieve information. Please, try again later.</p>
                    </Alert> }
                <div className='calendar-board-grid'>
                        <CalendarGridHeader />
                        <div className='grid-wrapper' ref={boardRef} tabIndex={-1}>
                            <CalendarGrid />
                            <CalendarEventList setIsShowEvent={setIsShowEvent} 
                                            setCurrentEvent={setCurrentEvent} 
                                            setCurrentEventPosition={setCurrentEventPosition} 
                                            setCurrentDateTime={setCurrentDateTime}
                                            currentEventPosition={currentEventPosition} />
                        </div>
                </div>
            </div>
            <div className={`side-bar ${isShowEvent ? 'show' : ''}`}>
                    { isShowEvent && <AddCalendarEvent currentDateTime={currentDateTime}
                                                    currentEventPosition={currentEventPosition}
                                                    currentEvent={currentEvent}
                                                    onClose={setIsShowEvent} /> }
            </div>
        </div>
        </>
    )
}

export default CalendarBoard;