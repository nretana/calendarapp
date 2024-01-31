import React, { useState } from 'react';

import { Event } from '@custom-types/calendar-types';
import { getDiffTime } from '@utils/calendar-utils';

import RemoveEvent from './RemoveCalendarEvent';
import CompactView from './views/CompactView';
import SummaryView from './views/SummaryView';
import FullView from './views/FullView';

import './ViewCalendarEvent.scss';


interface EventCalendarProps {
    event: Event,
    currentIndex: number
}

const ViewCalendarEvent: React.FC<EventCalendarProps> = ({ event, currentIndex }) => {

   const [isShow, setIsShow] = useState<boolean>(false);

   const diffTime =  getDiffTime(event.startTime, event.endTime);
   const totalDiffTime = diffTime.hour + diffTime.minute;
   const delay = 500 * (currentIndex);
   const animationSpecs = `fade-in 1.3s linear ${delay}ms forwards`;

   const onRemoveEventHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setIsShow(true);
   }

    return <>
            {(() => {
               if(totalDiffTime === 15) {
                  return <CompactView event={event} onRemove={onRemoveEventHandler} animationSpecs={animationSpecs} />
               }
               else if(totalDiffTime > 15 && totalDiffTime <= 30) {
                  return <SummaryView event={event} onRemove={onRemoveEventHandler} animationSpecs={animationSpecs} />
               }
               else {
                  return <FullView event={event} onRemove={onRemoveEventHandler} animationSpecs={animationSpecs} />
               }
            })()}

            { isShow && <RemoveEvent eventId={event.eventId} isShow={isShow} onClose={setIsShow}  /> }
           </>
}

export default ViewCalendarEvent;