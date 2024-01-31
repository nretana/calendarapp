import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@store/storeHooks';
import { CurrentDateTime, Event, EventBoard, EventPosition } from '@custom-types/calendar-types';
import { allowedKeyboardKeys } from '@custom-types/constants';
import { eventBoardAccessibility } from '@utils/ui-utils';
import { weeklyCalendarBoardActions } from '@store/slices/weeklyCalendarBoardSlice';

import { useGetEventsQuery } from '@store/services/events/eventApi'

import ViewCalendarEvent from '../../events/ViewCalendarEvent';
import SkeletonGrid from '../../../skeletons/SkeletonGrid';

import './CalendarEventList.scss';

interface CalendarEventListProps {
    setIsShowEvent: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentEvent: React.Dispatch<React.SetStateAction<Event | null | undefined>>,
    setCurrentEventPosition: React.Dispatch<React.SetStateAction<EventPosition>>,
    setCurrentDateTime: React.Dispatch<React.SetStateAction<CurrentDateTime>>
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ setIsShowEvent, setCurrentEvent, setCurrentEventPosition, setCurrentDateTime }) => {

    const dispatch = useAppDispatch();
    const selectedDate = useAppSelector(state => state.calendarPicker.selectedDate);
    const selectedWeekList = useAppSelector(state => state.calendarPicker.selectedWeekList);
    const weekEventBoardList = useAppSelector(state => state.weeklyCalendarBoard.eventBoardList);
    const isLoadingEventBoard = useAppSelector(state => state.weeklyCalendarBoard.isLoadingEventBoard);
    const isErrorEventBoard = useAppSelector(state => state.weeklyCalendarBoard.isErrorEventBoard);
    const refCurrentEventBoardList = useRef<(HTMLLIElement | null)[]>([]);

    const startDate = selectedWeekList[0].date;
    const endDate = selectedWeekList[selectedWeekList.length -1].date;
    const { data: eventList, isSuccess, isError, isLoading, isFetching, refetch } = useGetEventsQuery({ startDate, endDate });

    console.log('COMPONENT RELOAD [isloading] [isFetching] [isError]', isLoading, isFetching, isError);

    useEffect(() => {
        if(eventList !== undefined){
            dispatch(weeklyCalendarBoardActions.resetEventBoard());
            dispatch(weeklyCalendarBoardActions.fillEventBoard({ weekList: selectedWeekList, eventList }));
        }

        isError ? dispatch(weeklyCalendarBoardActions.errorStateBoard(true)) : dispatch(weeklyCalendarBoardActions.errorStateBoard(false));
    }, [eventList, isError]);

    useEffect(() => {
        console.log("REFETCH", selectedDate, selectedWeekList);
        refetch();
    }, [selectedWeekList]);

    const isEventGridAllowed = (): boolean =>{
        return (!isFetching && !isLoadingEventBoard && !isErrorEventBoard && isSuccess);
    }

    const isStateLoad = (): boolean =>{
        return (isLoading || isFetching || isLoadingEventBoard);
    }

    const onClickTimeHandler = (e: React.MouseEvent<HTMLLIElement>, 
                                rowIndex: number,
                                colIndex: number,
                                event: (Event| null | undefined)) => {
        e.preventDefault();
        e.stopPropagation();

        const currentHour = Math.floor((rowIndex) / 4);
        const currentMinutes = ((rowIndex % 4) * 15);
        const currentDay = selectedWeekList[colIndex].day;

        const newCurrentDateTime : CurrentDateTime = {
            day: currentDay,
            hour: currentHour,
            minute: currentMinutes
        }

        setCurrentEventPosition({ row: rowIndex, column: colIndex })
        setCurrentDateTime({ ...newCurrentDateTime });
        event !== null ? setCurrentEvent(event) : setCurrentEvent(null);
        setIsShowEvent(prevState => !prevState);
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLLIElement>, row: number, col: number) => {

       
        //if key pressed is not in the list, skip the process
        if(!allowedKeyboardKeys.includes(e.key)){
            return;
        }
        
        //if key pressed is comming from other html elements, skip the process
        if(e.target !== e.currentTarget){
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        eventBoardAccessibility(e.key, refCurrentEventBoardList, row, col);
    }

    return (<>
            { isStateLoad() && <SkeletonGrid /> }
            { isEventGridAllowed() &&
            <ol className='grid-event'>
                {weekEventBoardList.map((eventBoardRow: EventBoard[], rowIndex: number) => {
                    return <React.Fragment key={`grid_event_${rowIndex}`}>
                            { eventBoardRow.map((eventBoard: EventBoard, colIndex: number) => {

                                const key = `app_${(rowIndex + 1)}_${(colIndex + 1)}`;
                                const eventFound = eventBoard.event;
                                const hideClass = eventBoard?.isSpanRow ? 'hide': '';

                                let currentRef = null;
                                let tabIndex = -1;
                                let isSetTabIndexOnFirstElem = false;
                                if(refCurrentEventBoardList !== null){
                                    //current element with focus (if there's no one, set the tab index in the first cell)
                                    const selectedElementIndex = refCurrentEventBoardList.current.findIndex(el => el?.tabIndex === 0);
                                    isSetTabIndexOnFirstElem = selectedElementIndex === -1 && rowIndex === 0 && colIndex === 0;

                                    //gets the tabIndex value if the element already has it
                                    currentRef = refCurrentEventBoardList.current[(rowIndex*7) + colIndex];
                                    tabIndex = currentRef?.tabIndex ?? tabIndex;
                                }

                                if(eventFound !== null && !eventBoard.isSpanRow){
                                    return <li key={key}
                                            id={key}
                                            tabIndex={(isSetTabIndexOnFirstElem) ? 0 : tabIndex}
                                            {...(tabIndex === 0 ? { 'aria-selected': 'true'} : {})}
                                            className='app-item unavailable-item'
                                            data-event-id={eventFound?.eventId}
                                            onClick={(e) => onClickTimeHandler(e, rowIndex, colIndex, eventFound)}
                                            ref={ (item) => refCurrentEventBoardList.current.push(item) }
                                            onKeyDown={(e) => onKeyDownHandler(e, rowIndex, colIndex)}
                                            style={{ gridRowStart: eventBoard?.gridStart, gridRowEnd: eventBoard?.gridEnd, gridColumn: eventBoard?.gridColumn }}>
                                                    { eventFound !== null && <ViewCalendarEvent event={eventFound} currentIndex={colIndex} /> }
                                            </li>
                                }

                                return <li key={key}
                                        id={key}
                                        tabIndex={(isSetTabIndexOnFirstElem) ? 0 : tabIndex}
                                        {...(tabIndex === 0 ? { 'aria-selected': 'true'} : {})}
                                        className={`app-item available-item ${hideClass}`}
                                        onClick={(e) => onClickTimeHandler(e, rowIndex, colIndex, eventFound)}
                                        ref={ (item) => refCurrentEventBoardList.current.push(item) }
                                        onKeyDown={(e) => onKeyDownHandler(e, rowIndex, colIndex)}></li>
                            })}
                        </React.Fragment>
                })}
            </ol> }
        </>
    )
}

export default CalendarEventList;