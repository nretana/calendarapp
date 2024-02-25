import React from 'react';

import { Event } from '@custom-types/calendar-types';
import './SummaryView.scss';

type SummaryViewProps = {
    event: Event,
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void,
    animationSpecs: string
}

const SummaryView: React.FC<SummaryViewProps> = ({ event, onRemove, animationSpecs }) => {
    
    const colorClass = event.color.replace('#', '');
    const eventClass = `event-calendar-summary-view event-color-${colorClass}`;

    return(
        <div className={eventClass} data-id={event.eventId} style={{ animation: animationSpecs }}>
             <div className='event-header'>
               <div>
                  {`${event.startTime} — ${event.endTime}`}
               </div>
               <button className='btn-close' onClick={onRemove} aria-label='Remove icon' tabIndex={-1}></button>
             </div>
             <div className='event-body'>
                <div className='event-title'>{event.title}</div>
             </div>
        </div>
    )
};

export default SummaryView;