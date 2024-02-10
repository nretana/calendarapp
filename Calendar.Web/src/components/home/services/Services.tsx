import Bullets from '../bullets/Bullets';
import curvedLeftArrowImg from '@assets/imgs/curved_left_arrow.svg';
import './Services.scss';

const bullets = [
    'Manage work, personal life and everything in between.',
    'Different time zones available.',
    'Personalized dashboard. Perfect for every one.',
    'Set email notifications and reminders for your plans.',
    'Available everywhere you go.'
]

const Services = () => {
    return(<>
        <div className='grid-cell-3'></div>
        <div className='grid-cell-4 sc-services'>
            <h2 className='pe-5'>
                <span>Save </span>
                <span className='text-primary'>time </span>
                <span>and get more done</span>
            </h2>
            <Bullets items={bullets} />
            <div className='text-center d-none d-xl-block'>
                <img className='img-fluid' src={curvedLeftArrowImg} alt='' />
            </div>
        </div>
        
  </>)
};

export default Services;