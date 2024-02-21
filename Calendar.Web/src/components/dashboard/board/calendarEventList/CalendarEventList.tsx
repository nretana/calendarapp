import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@store/storeHooks';
import { CurrentDateTime, Event, EventBoard, EventPosition } from '@custom-types/calendar-types';
import { allowedKeyboardKeys } from '@custom-types/constants';
import { eventBoardAccessibility, getDateTimeLabel, resetBoardAccessibility } from '@utils/ui-utils';
import { weeklyCalendarBoardActions } from '@store/slices/weeklyCalendarBoardSlice';

import { useGetEventsQuery } from '@store/services/events/eventApi'

import ViewCalendarEvent from '../../events/viewCalendarEvent/ViewCalendarEvent';
import SkeletonGrid from '@components/skeletons/SkeletonGrid';


import './CalendarEventList.scss';

type CalendarEventListProps = {
    setIsShowEvent: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentEvent: React.Dispatch<React.SetStateAction<Event | null | undefined>>,
    setCurrentEventPosition: React.Dispatch<React.SetStateAction<EventPosition>>,
    setCurrentDateTime: React.Dispatch<React.SetStateAction<CurrentDateTime>>,
    currentEventPosition: EventPosition

}

type CalendarGridItemAttr = {
    key: string,
    id: string,
    tabIndex: number,
    role: string,
    className: string,
    dataEventId?: string,
    ['aria-label']: string,
    ['aria-selected']?: boolean
    ['aria-rowindex']: number,
    ['aria-colindex']: number,
    ['data-row']: number,
    ['data-col']: number,
    ['data-has-event']: boolean,
    style?: React.CSSProperties
    onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ setIsShowEvent, setCurrentEvent, setCurrentEventPosition, setCurrentDateTime, currentEventPosition }) => {

    const dispatch = useAppDispatch();
    const selectedDate = useAppSelector(state => state.calendarPicker.selectedDate);
    const selectedWeekList = useAppSelector(state => state.calendarPicker.selectedWeekList);
    const weekEventBoardList = useAppSelector(state => state.weeklyCalendarBoard.eventBoardList);
    const isLoadingEventBoard = useAppSelector(state => state.weeklyCalendarBoard.isLoadingEventBoard);
    const isErrorEventBoard = useAppSelector(state => state.weeklyCalendarBoard.isErrorEventBoard);
    const refEventGrid = useRef<HTMLOListElement | null>(null);

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

    const isLoadState = (): boolean =>{
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

        setCurrentEventPosition({ row: rowIndex, column: colIndex });
        setCurrentDateTime({ ...newCurrentDateTime });
        event !== null ? setCurrentEvent(event) : setCurrentEvent(null);
        setIsShowEvent(prevState => !prevState);

        //resetBoardAccessibility(refEventGrid);
    }

    const onKeyDownEventGridHandler = (e: React.KeyboardEvent<HTMLOListElement>) => {
        
        if(!allowedKeyboardKeys.includes(e.key)){
            return;
        }

        if(!(e.target instanceof HTMLLIElement)){
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        const currentElem = e.target as HTMLLIElement;
        eventBoardAccessibility(e.key, currentElem, refEventGrid);
    }

    return (<>
            { isLoadState() && <SkeletonGrid /> }
            { isEventGridAllowed() &&
              <ol className='grid-event' 
                  tabIndex={-1} 
                  role='grid'
                  aria-rowcount={96}
                  aria-colcount={7}
                  ref={refEventGrid} 
                  onKeyDown={(e) => onKeyDownEventGridHandler(e)}>
                  { weekEventBoardList.map((eventBoardRow: EventBoard[], rowIndex: number) => {
                     return <React.Fragment key={`grid_event_${rowIndex}`}>
                             { eventBoardRow.map((eventBoard: EventBoard, colIndex: number) => {

                                const key = `app_${(rowIndex + 1)}_${(colIndex + 1)}`;
                                const eventFound = eventBoard.event;
                                const hideClass = eventBoard?.isSpanRow ? 'hide': '';
                                const ariaLabel = getDateTimeLabel(rowIndex, colIndex, selectedWeekList);
                                const availableClass= eventFound !== null ? 'unavailable-item' : 'available-item';

                                const gridItemAttributes : CalendarGridItemAttr = {
                                    key: key,
                                    id: key,
                                    tabIndex: -1,
                                    role: 'gridcell',
                                    className: `app-item ${availableClass} ${hideClass}`,
                                    ['aria-label']: ariaLabel,
                                    ['aria-rowindex']: (rowIndex + 1),
                                    ['aria-colindex']: (colIndex + 1),
                                    ['data-row']: rowIndex,
                                    ['data-col']: colIndex,
                                    ['data-has-event']: eventFound !== null,
                                    onClick:(e) => onClickTimeHandler(e, rowIndex, colIndex, eventFound)
                                }

                                if(eventBoard.isSelected){
                                    gridItemAttributes.tabIndex = 0;
                                    gridItemAttributes['aria-selected'] = true;
                                }

                                if(eventFound !== null && !eventBoard.isSpanRow){
                                    gridItemAttributes.style = { gridRowStart: eventBoard?.gridStart, 
                                                                 gridRowEnd: eventBoard?.gridEnd, 
                                                                 gridColumn: eventBoard?.gridColumn 
                                };

                                return <li { ...gridItemAttributes} data-event-id={eventFound?.eventId}>
                                          { eventFound !== null && <ViewCalendarEvent event={eventFound} 
                                                                                      currentIndex={colIndex} /> }
                                        </li>
                                }

                                return <li {...gridItemAttributes}></li>
                            })}
                        </React.Fragment>
                })}
            </ol> }
        </>
    )
}

export default CalendarEventList;