import Bullets from './containers/Bullets';
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
                 alt=''/>
        </div>
        <div className='grid-cell-6'></div>
    </>);
  /* return(<section className='sc-benefits'>
                <div className='row'>
                    <div className='col-6'>
                        <h2>
                            <span>We make</span>
                            <span className='text-primary ms-2'>scheduling</span>
                            <span>easy than ever for you</span>
                        </h2>
                        <Bullets items={bullets} />
                        <img className='img-fluid mt-5' src={calendarBoardAAccessibilityImg} alt='' />
                    </div>
                    <div className='col-6 align-self-start text-center py-0'>
                        <img className='img-fluid' src={curvedLeftArrowImg} alt='' />
                    </div>
                </div>
            </section>) */
};

export default Benefits;
