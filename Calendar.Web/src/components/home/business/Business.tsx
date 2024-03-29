import Bullets from '../bullets/Bullets';

import noteImg from '@assets/imgs/note_img.svg';
import calendarBoardImg from '@assets/imgs/calendar_board_preview_img.svg';
import curvedRightArrowImg from '@assets/imgs/curved_right_arrow.svg';

import './Business.scss';
import React from 'react';

const bullets = [
  'Chronos is a new platform for simplifying your busy schedule.',
  'Supercharge your productivity. Streamline work by doing it and seeing it in one place.',
  'Eliminate appointment chaos. Consolidate your events in one single app.',
];

const Business: React.FC = () => {
  return (
    <>
      <div className='grid-cell-1 sc-business'>
        <h2>
          <span>Simplify your </span>
          <span className='text-primary'>day</span>
        </h2>
        <Bullets items={bullets} />
        <img className='img-fluid mt-4'
             src={calendarBoardImg}
             alt='calendar board preview'
             loading='lazy' />
        <div className='text-center mt-5 d-none d-xl-block'>
          <img className='img-fluid' src={curvedRightArrowImg} alt='' />
        </div>
      </div>
      <div className='grid-cell-2'>
        <img className='img-fluid' src={noteImg} alt='' loading='lazy' />
      </div>
    </>
  );
};

export default Business;
