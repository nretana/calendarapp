import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Event, EventBoard } from '@custom-types/calendar-types';

import { getGridPosition, getIndexByTime } from '@utils/calendar-utils';

export type AppointmentBoardState = {
    eventList: Event[],
    eventBoardList: EventBoard[]
}

const addEventToBoard = (event: Event, eventBoardList: EventBoard[]) : EventBoard[]  => {
    const indexBoard = getIndexByTime(event.startTime);
    const gridStartIndex = getGridPosition(event.startTime);
    const gridEndIndex = getGridPosition(event.endTime);
    const gridStart = gridStartIndex > 0 ? gridStartIndex : 'auto';
    const gridEnd = gridEndIndex > 0 ? gridEndIndex : 'auto';
    const currentIndexInBoard = gridStartIndex - 1;

    const newEventItem : EventBoard = {
        event,
        indexBoard,
        gridStart: gridStart.toString(),
        gridEnd: gridEnd.toString(),
        isSpanRow: false,
    }

    eventBoardList[currentIndexInBoard] = {...newEventItem};
    const spanNum =  (gridEndIndex - 1) - (gridStartIndex - 1);
    const spanRowIndexList = new Array(spanNum - 1).fill(0).map((item: number, index: number) => (index + 1) + currentIndexInBoard);

    spanRowIndexList.forEach(rowIndex => {
        const eventBoardItem = {...eventBoardList[rowIndex]};
        eventBoardItem.event = newEventItem.event;
        eventBoardItem.isSpanRow = true;
        eventBoardList[rowIndex] = {...eventBoardItem};
    });

    return eventBoardList;
}

const removeEventFromBoard = (eventId: string, eventBoardList: EventBoard[]) : EventBoard[] => {
    eventBoardList.forEach((e, index) => {
        if(e?.event?.eventId === eventId){
            eventBoardList[index] = {...initEventBoard};
        }
    });
    return eventBoardList;
}

const initEventBoard : EventBoard = {
    event: null,
    indexBoard: -1,
    gridStart: 'auto',
    gridEnd: 'auto',
    isSpanRow: false,
}

const initBoard = new Array<EventBoard>(96).fill(initEventBoard);

const initialState : AppointmentBoardState = {
    eventList: [],
    eventBoardList: [...initBoard]
}

const calendarBoardSlice = createSlice({
    name: 'calendarBoard',
    initialState,
    reducers: {

        addEvent: (state, action: PayloadAction<Event>) => {
            const updateEventList = [...state.eventList];
            const newEvent = action.payload;
            const updateEventBoardList = addEventToBoard(newEvent, [...state.eventBoardList]);

            state.eventList = [...updateEventList, newEvent];
            state.eventBoardList = [...updateEventBoardList];
        },

        updateEvent: (state, action: PayloadAction<Event>) => {
            const event = action.payload;
            const eventList = [...state.eventList];
            let updateEventBoardList = [...state.eventBoardList];
            
            //const eventFound = updateEventBoardList.find(e => e?.event?.id === event.id);
            updateEventBoardList = removeEventFromBoard(event.eventId, updateEventBoardList);
            updateEventBoardList = addEventToBoard(event, updateEventBoardList);

            const eventIndex = eventList.findIndex(e => e.eventId === event.eventId);
            eventList[eventIndex] = {...event};

            state.eventList = [...eventList];
            state.eventBoardList = [...updateEventBoardList];
        },

        removeEvent: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const eventList = [...state.eventList];
            const updateEventList = eventList.filter(e => e.eventId !== id);
            const updateEventBoardList = removeEventFromBoard(id, [...state.eventBoardList]);
            
            state.eventList = [...updateEventList];
            state.eventBoardList = [...updateEventBoardList];
        },

        fillEventBoard: (state, action: PayloadAction<string>) => {
            const eventList = [...state.eventList];
            const selectedDate = action.payload;
            const eventListByDate = eventList.filter(e => e.eventDate === selectedDate);
            const eventListBoard = [...state.eventBoardList];

            eventListByDate.forEach(event => {
                addEventToBoard(event, eventListBoard);
            });
            state.eventBoardList = [...eventListBoard];
        },

        resetEventBoard: (state) => {
            state.eventBoardList = [...initBoard];
        }
    }
});

export const calendarBoardActions = calendarBoardSlice.actions;
export default calendarBoardSlice;


