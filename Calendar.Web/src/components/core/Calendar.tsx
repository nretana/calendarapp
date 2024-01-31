import { CalendarDate } from '@internationalized/date';
import { forwardRef, ForwardedRef  } from 'react';
import { Button, Calendar as AriaCalendar, CalendarCell, CalendarGrid, CalendarProps as AriaCalendarProps, DateValue, Header, Heading, Text } from 'react-aria-components';

interface CalendarProps<T extends DateValue> extends AriaCalendarProps<T>{
    errorMessage?: string;
}

const Calendar = <T extends DateValue>({ errorMessage, ...props }: CalendarProps<T>, ref: ForwardedRef<HTMLTableElement>) => {
    return (
        <AriaCalendar {...props } aria-label='select a date'>
            <Header>
                <Button slot="previous">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                        <path d="M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.25-6.25a.75.75 
                        0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z"></path>
                    </svg>
                </Button>
                    <Heading />
                <Button slot="next">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                        <path d="M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12 8.72 6.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l6.25 
                        6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"></path>
                    </svg>
                </Button>
            </Header>
            <CalendarGrid ref={ref}>
                {(date) => <CalendarCell date={date} /> }
            </CalendarGrid>
            {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
        </AriaCalendar>)
}


export default forwardRef<HTMLTableElement, CalendarProps<CalendarDate>>(Calendar);