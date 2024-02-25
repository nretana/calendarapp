import React from 'react';

import { Event } from '@custom-types/calendar-types';
import './CompactView.scss';

type CompactViewProps = {
    event: Event,
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void,
    animationSpecs: string
}

const CompactView: React.FC<CompactViewProps> = ({ event, onRemove, animationSpecs }) => {

    const colorClass = event.color.replace('#', '');
    const eventClass = `event-calendar-compact-view event-color-${colorClass}`;

    return(
        <div className={eventClass} data-id={event.eventId} style={{ animation: animationSpecs }}>
             <div className='event-header'>
               <div>
                  {`${event.startTime} — ${event.endTime}`}
               </div>
               <button type='button' className='btn-close' onClick={onRemove} aria-label='Remove icon' tabIndex={-1}>
                </button>
             </div>
         </div>
    )
};

export default CompactView;