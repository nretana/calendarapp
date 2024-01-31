import React from 'react';

import { Event } from '@custom-types/calendar-types';
import './FullView.scss';

interface FullViewProps {
    event: Event,
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void,
    animationSpecs: string
}

const FullView: React.FC<FullViewProps> = ({ event, onRemove, animationSpecs }) => {
    return(
        <div className='event-calendar-full-view' data-id={event.eventId} style={{ backgroundColor: event.color, animation: animationSpecs }}>
             <div className='event-header' style={{ backgroundColor: event.color }}>
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