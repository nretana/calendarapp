import React from 'react';
import { Radio } from 'react-aria-components';
import RadioGroup from '../core/RadioGroup';


import './ColorPicker.scss';

type ColorPickerProps = {
    id?: string,
    colors: string[],
    color: string,
    setColor: React.Dispatch<React.SetStateAction<string>>
}

const ColorPicker: React.FC<ColorPickerProps> = ({ id, colors, color, setColor }) => {
    return(<RadioGroup className='react-aria-RadioGroup color-picker' 
                       value={color}
                       id={id}
                       aria-label='Select a color'
                       onChange={setColor} 
                       orientation='horizontal'>
                       {colors.map((color, index) => <Radio key={`radio_c${index}`} className='color-picker-radio' value={color} aria-label={`${color} color`}>
                                                    <span className='color-radio' style={{ background: color }}></span>
                                                </Radio>)}
           </RadioGroup>)
}

export default ColorPicker;