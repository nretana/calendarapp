import './SliderItem.scss';

type SliderItemProps = {
    imgSrc: string,
    imgAlt: string,
    label: string,
    description: string
}

const SliderItem: React.FC<SliderItemProps> = ({ imgSrc, imgAlt, label, description }) => {
    return(<div className='slider-item'>
             <img className='slider-image img-fluid' src={imgSrc} alt={imgAlt} loading='lazy' />
             <div className='slider-description'>
                <p>{description}</p>
             </div>
             <div className='text-start'>
                <span className='slider-label'>— {label}</span>
             </div>
           </div>)
}

export default SliderItem;