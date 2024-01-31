import checkIcon from '@assets/imgs/check-circle.svg';

import './Bullets.scss';

interface BulletProps {
    items: string[],
}

const Bullets: React.FC<BulletProps> = ({ items }) => {
                                        return(<div className='bullets'>
                                                 { items.map((text, index) => <div key={index} className='d-flex align-items-center mb-4'>
                                                                                    <img className='img-fluid' src={checkIcon} width={33} height={33} alt='' />
                                                                                    <p className='ms-3'>{text}</p>
                                                                                </div>)}
                                               </div>)
}

export default Bullets;