import React from 'react';

import './CalendarGrid.scss';

const CalendarGrid: React.FC = () => {
  const timeArr = Array<number[]>(24).fill(Array<number>(8).fill(0));

  return (
    <div className='grid-time' tabIndex={-1}>
        {timeArr.map((daysArr: number[], timeIndex: number) => {
            const timeKey = `grid_time_${timeIndex + 1}`;
            return (
                <React.Fragment key={timeKey}>
                    {daysArr.map((item: number, dayIndex: number) => {
                        const dayKey = `day_${dayIndex + 1}`;
                        return dayIndex === 0 ? (
                            <div key={`${timeKey}_${dayKey}`} className='time-cell'>
                                <span className='hour me-1'>{timeIndex < 10 ? `0${timeIndex}` : timeIndex}</span>
                                <span className='minute'>00</span>
                            </div>
                        ) : (<div key={`${timeKey}_${dayKey}`} className='time-cell'></div>);
                    })}
                </React.Fragment>
            );
        })}
    </div>
  );
};

export default CalendarGrid;
