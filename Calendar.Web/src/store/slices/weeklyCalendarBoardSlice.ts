import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Event, EventBoard, EventPosition, WeekDay } from '@custom-types/calendar-types';
import { getGridPosition, getIndexByTime, getDatesByWeekList } from '@utils/calendar-utils';

export interface AppointmentBoardState {
    eventList: Event[],
    eventBoardList: EventBoard[][],
    isLoadingEventBoard: boolean,
    isErrorEventBoard: boolean
}

/* Initial State for the slice */
const initEventBoard : EventBoard = {
    event: null,
    indexBoard: -1,
    gridStart: 'auto',
    gridEnd: 'auto',
    isSpanRow: false,
}

const initBoard = Array<EventBoard[]>(96).fill(Array<EventBoard>(7).fill(initEventBoard));

const initialState : AppointmentBoardState = {
    eventList: [],
    eventBoardList: [...initBoard],
    isLoadingEventBoard: false,
    isErrorEventBoard: false
}

/** calculation for grid position is from 1 to n and NOT starting from zero */
const addEventToCalendarBoard = (eventPosition: EventPosition, event: Event, eventBoardList: EventBoard[][]) : EventBoard[][]  => {
    const indexBoard = getIndexByTime(event.startTime);
    const updateEventBoardList = [...eventBoardList];

    const gridStartIndex = getGridPosition(event.startTime);
    const gridEndIndex = getGridPosition(event.endTime);
    const gridStart = gridStartIndex > 0 ? gridStartIndex : 'auto';
    const gridEnd = gridEndIndex > 0 ? gridEndIndex : 'auto';
    const currentIndexInBoard = eventPosition.row;//gridStartIndex - 1;

    const newEventItem : EventBoard = {
        event,
        indexBoard,
        gridStart: gridStart.toString(),
        gridEnd: gridEnd.toString(),
        gridColumn: eventPosition.column + 1,
        isSpanRow: false,
    }

    updateEventBoardList[currentIndexInBoard][eventPosition.column] = {...newEventItem};
    const spanNum =  (gridEndIndex - 1) - (gridStartIndex - 1);
    const spanRowIndexList = Array(spanNum - 1).fill(0).map((item: number, index: number) => (index + 1) + currentIndexInBoard);

    spanRowIndexList.forEach(rowIndex => {
        const eventBoardItem = {...updateEventBoardList[rowIndex][eventPosition.column]};
        eventBoardItem.event = newEventItem.event;
        eventBoardItem.isSpanRow = true;
        eventBoardList[rowIndex][eventPosition.column] = {...eventBoardItem};
    });

    return eventBoardList;
}

const removeEventFromBoard = (eventId: string, eventBoardList: EventBoard[][]) : EventBoard[][] => {
    eventBoardList.forEach((eventRow, indexRow) => {
        eventRow.forEach((e, indexCol) => {
            if(e?.event?.eventId === eventId){
                eventBoardList[indexRow][indexCol] = {...initEventBoard};
            }
        })
    });
    return eventBoardList;
}

const weeklyCalendarBoardSlice = createSlice({
    name: 'weeklyCalendarBoard',
    initialState,
    reducers: {
        addEvent: (state, action: PayloadAction<{eventPosition: EventPosition, event: Event }>) => {
            const newEvent = action.payload.event;
            const eventPosition = action.payload.eventPosition;
            const updateEventBoardList = addEventToCalendarBoard(eventPosition, newEvent, [...state.eventBoardList]);

            state.eventBoardList = [...updateEventBoardList];
            return state;
        },

        updateEvent: (state, action: PayloadAction<{eventPosition: EventPosition, event: Event}>) => {
            const event = action.payload.event;
            const eventPosition = action.payload.eventPosition;
            let updateEventBoardList = [...state.eventBoardList];

            
            updateEventBoardList = removeEventFromBoard(event.eventId, updateEventBoardList);
            updateEventBoardList = addEventToCalendarBoard(eventPosition, event, updateEventBoardList);

            state.eventBoardList = [...updateEventBoardList];
            return state;
        },

        removeEvent: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const updateEventBoardList = removeEventFromBoard(id, [...state.eventBoardList]);
            
            state.eventBoardList = [...updateEventBoardList];
            return state;
        },

        fillEventBoard: (state, action: PayloadAction<{ weekList: WeekDay[], eventList: Event[] }>) => {

            const eventList = action.payload.eventList;//[...state.eventList];
            const eventListBoard = [...state.eventBoardList];
            const currentWeekList = action.payload.weekList;
            
            eventList.forEach(event => {
                const eventDate = new Date(event.eventDate);
                const row = getGridPosition(event.startTime) - 1;
                const column = currentWeekList.findIndex(d => d.day === eventDate.getUTCDate());
                const eventPosition: EventPosition = { row, column }
                addEventToCalendarBoard(eventPosition, event, eventListBoard);
            });

            state.eventList = eventList;
            state.eventBoardList = [...eventListBoard];
        },

        loadingStateBoard: (state, action: PayloadAction<boolean>) => {
            state.isLoadingEventBoard = action.payload;
        },

        errorStateBoard: (state, action: PayloadAction<boolean>) => {
            state.isErrorEventBoard = action.payload;
        },

        resetEventBoard: (state) => {
            state.eventBoardList = [...initBoard];
        }
    }
});

export const weeklyCalendarBoardActions = weeklyCalendarBoardSlice.actions;
export default weeklyCalendarBoardSlice;


