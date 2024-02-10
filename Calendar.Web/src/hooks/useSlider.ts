import { useEffect, useState, useMemo } from 'react';
import { SlideItem } from '@custom-types/ui-types';


type SliderProps = {
    slideItems: SlideItem[],
    intervalTime: number
}

type Slider = {
    currentSlides: SlideItem[],
    prevSlide: () => void,
    nextSlide: () => void
}


const useSlider = (sliderProps: SliderProps) : Slider => {

    const [index, setIndex] = useState<number>(0);
    const initVal : Array<SlideItem[]> = [];
    const slideItemGroupList = useMemo(() => sliderProps.slideItems.reduce((accum, item, index) => {
                                                if(index % 2 === 0){
                                                    accum.push([sliderProps.slideItems[index], sliderProps.slideItems[index + 1]]);
                                                }
                                                return accum;
                                             }, initVal), [sliderProps.slideItems, initVal]);
    
    const prevSlide = () => {
        setIndex((prevState: number) => (prevState - 1) < 0 ? slideItemGroupList.length - 1 : (prevState - 1));
    };

    const nextSlide = () => {
        setIndex((prevState: number) => (prevState + 1) >= slideItemGroupList.length ? 0 : (prevState + 1));
    }
    
    useEffect(() => {
       const intervalFn = () => {
            nextSlide();
       };

       const intervalTimeFn = setInterval(intervalFn, (sliderProps.intervalTime * 1000));
       return () => {
            clearInterval(intervalTimeFn);
       }
    }, [prevSlide, nextSlide]);

    return { currentSlides: slideItemGroupList[index] , prevSlide, nextSlide }
}

export default useSlider;