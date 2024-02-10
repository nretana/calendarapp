import React from 'react';

import { Event } from '@custom-types/calendar-types';
import './SummaryView.scss';

type SummaryViewProps = {
    event: Event,
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void,
    animationSpecs: string
}

const SummaryView: React.FC<SummaryViewProps> = ({ event, onRemove, animationSpecs }) => {
    return(
        <div className='event-calendar-summary-view' data-id={event.eventId} style={{ backgroundColor: event.color, animation: animationSpecs }}>
             <div className='event-header' style={{ backgroundColor: event.color }}>
               <div>
                  {`${event.startTime} — ${event.endTime}`}
               </div>
               <button className='btn-close' onClick={onRemove} aria-label='Remove icon'></button>
             </div>
             <div className='event-body'>
                <div className='event-title'>{event.title}</div>
             </div>
        </div>
    )
};

export default SummaryView;