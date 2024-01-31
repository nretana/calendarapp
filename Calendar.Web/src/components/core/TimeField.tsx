import { DateInput, DateSegment, TimeField as AriaTimeField, TimeFieldProps as AriaTimeFieldProps, TimeValue } from 'react-aria-components';

//import './UITimeField.scss';

interface TimeFieldProps<T extends TimeValue> extends AriaTimeFieldProps<T> {
    
}

function TimeField <T extends TimeValue>({ ...props }: TimeFieldProps<T> )  {
    return(<AriaTimeField {...props} className={`form-control ${props.isInvalid ? 'is-invalid': '' } `}>
                <DateInput>
                    {segment => <DateSegment segment={segment}/> }
                </DateInput>
           </AriaTimeField>)
}

export default TimeField;