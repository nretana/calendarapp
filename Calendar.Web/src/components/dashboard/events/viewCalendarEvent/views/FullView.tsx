import React from 'react';

import { Event } from '@custom-types/calendar-types';
import './FullView.scss';

type FullViewProps = {
    event: Event,
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void,
    animationSpecs: string
}

const FullView: React.FC<FullViewProps> = ({ event, onRemove, animationSpecs }) => {

    const colorClass = event.color.replace('#', '');
    const eventClass = `event-calendar-full-view event-color-${colorClass}`;
    console.log(event.color);

    return(
        <div className={eventClass} data-id={event.eventId} style={{ animation: animationSpecs }}>
             <div className='event-header'>
               <div>
                  {`${event.startTime} — ${event.endTime}`}
               </div>
               <button type='button' className='btn-close' onClick={onRemove} aria-label='Remove icon'>
               </button>
             </div>
             <div className='event-body'>
                <div className='event-title'>{event.title}</div>
                <div className='event-description'>{event.notes}</div>
             </div>
        </div>
    )
};

export default FullView;