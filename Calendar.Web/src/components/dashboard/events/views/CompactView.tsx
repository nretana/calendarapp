import React from 'react';

import { Event } from '@custom-types/calendar-types';
import './CompactView.scss';

interface CompactViewProps {
    event: Event,
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void,
    animationSpecs: string
}

const CompactView: React.FC<CompactViewProps> = ({ event, onRemove, animationSpecs }) => {
    return(
        <div className='event-calendar-compact-view' data-id={event.eventId} style={{ backgroundColor: event.color, animation: animationSpecs }}>
             <div className='event-header' style={{ backgroundColor: event.color }}>
               <div>
                  {`${event.startTime} — ${event.endTime}`}
               </div>
               <button type='button' className='btn-close' onClick={onRemove} aria-label='Remove icon'>
                </button>
             </div>
         </div>
    )
};

export default CompactView;