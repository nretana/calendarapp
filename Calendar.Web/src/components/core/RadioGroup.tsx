import { RadioGroupProps as AriaRadiogroupProps, RadioGroup as AriaRadioGroup, Radio } from 'react-aria-components';
import { RadioOption } from '@custom-types/ui-types';

interface RadioGroupProps extends Omit<AriaRadiogroupProps, 'children'> {
    radioOptions?: RadioOption[] | undefined,
    children?: React.ReactNode
    //children?: React.ReactNode,
    //label?: string,
    //description?: string,
    //errorMessage?: string | ((validation: ValidationResult) => string)
}

const RadioGroup : React.FC<RadioGroupProps> = ({ radioOptions, children, ...props }) => {
    return(
        <AriaRadioGroup {...props}>
          {radioOptions !== undefined ? radioOptions.map((op: RadioOption) => <Radio value={op.value}>{op.label !== null ? op.label : '' }</Radio>): children }
        </AriaRadioGroup>
    )
}

export default RadioGroup