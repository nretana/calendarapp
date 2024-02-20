import { v4 as uuidv4 } from 'uuid';
import SliderItem from './sliderItem/SliderItem';
import useSlider from '@hooks/useSlider';
import { SlideItem } from '@custom-types/ui-types';

import testimonyImg from '@assets/imgs/testimonies/customer-1.png';
import testimonyImg2 from '@assets/imgs/testimonies/customer-2.png';
import testimonyImg3 from '@assets/imgs/testimonies/customer-3.png';
import testimonyImg4 from '@assets/imgs/testimonies/customer-4.png';
import testimonyImg5 from '@assets/imgs/testimonies/customer-5.png';
import testimonyImg6 from '@assets/imgs/testimonies/customer-6.png';
import ChevronLeft from '@assets/imgs/chevron-left.svg';
import ChevronRight from '@assets/imgs/chevron-right.svg';

import './Slider.scss';
import { useEffect, useRef, useState } from 'react';

const sliderItemList: SlideItem[] = [
  {
    imgSrc: testimonyImg,
    imgAlt: 'Jamie loves Chronos',
    label: 'Jamie',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    imgSrc: testimonyImg2,
    imgAlt: 'Alexander loves Chronos',
    label: 'Alex',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. content of a page when looking at its layout.'
  },
  {
    imgSrc: testimonyImg3,
    imgAlt: 'Donna loves Chronos',
    label: 'Donna',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
  },
  {
    imgSrc: testimonyImg4,
    imgAlt: 'Jim loves Chronos',
    label: 'Jim',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. content of a page when looking at its layout.'
  },
  {
    imgSrc: testimonyImg5,
    imgAlt: 'Millie loves Chronos',
    label: 'Millie',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
  },
  {
    imgSrc: testimonyImg6,
    imgAlt: 'Mike loves Chronos',
    label: 'Mike',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. content of a page when looking at its layout.'
  }
];


const Slider: React.FC = () => {

    const { currentSlides, prevSlide, nextSlide }  = useSlider({ slideItems: sliderItemList, intervalTime: 15 });
    const slide1 = currentSlides[0];
    const slide2 = currentSlides[1];
    const refSlider = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const htmlElement = refSlider.current;
      if(htmlElement !== null){
        htmlElement.classList.remove('fade-in');
        void htmlElement.offsetHeight;
        htmlElement.classList.add('fade-in');
      }
    }, [currentSlides]);

    return(<div className='slider-content'>
             <div className='row slider-current-slide' ref={refSlider}>
                  <div className='col-12 col-sm-6'>
                    <SliderItem imgSrc={slide1.imgSrc} 
                                imgAlt={slide1.imgAlt}
                                label={slide1.label} 
                                description={slide1.description} />
                  </div>
                  <div className='col-12 col-sm-6'>
                    <SliderItem imgSrc={slide2.imgSrc} 
                                imgAlt={slide2.imgAlt} 
                                label={slide2.label} 
                                description={slide2.description} />
                  </div>
              </div>
             <div className='slider-control'>
               <button type='button' className='btn btn-round me-3' onClick={() => prevSlide()}>
                 <img src={ChevronLeft} alt='prev slide' width={35} height={35} />
               </button>
               <button type='button' className='btn btn-round' onClick={() => nextSlide()}>
                 <img src={ChevronRight} alt='next slide' width={35} height={35} />
               </button>
             </div>
           </div>)
}

export default Slider;