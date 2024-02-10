import Bullets from '../bullets/Bullets';
import calendarBoardAccessibilityImg from '@assets/imgs/calendar_board_accessibility_img.svg';

import './Benefits.scss';

const bullets = ['Our calendar support accessibility features.'];

const Benefits = () => {
  return (<>
        <div className='grid-cell-5 sc-benefits'>
            <h2>
                <span>We make </span>
                <span className='text-primary'>scheduling </span>
                <span>easy than ever for you</span>
            </h2>
            <Bullets items={bullets} />
            <img className='img-fluid mt-5'
                 src={calendarBoardAccessibilityImg}
                 alt='calendar board preview'
                 loading='lazy' />
        </div>
        <div className='grid-cell-6'></div>
    </>);
};

export default Benefits;
