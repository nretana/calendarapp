import { v4 as uuidv4 } from 'uuid';

import CustomerGridCell from '../customerGridCell/CustomerGridCell';
import CustomerLogo from '../customerLogo/CustomerLogo';
import CustomerText from '../customerText/CustomerText';

import companyLogo1 from '@assets/imgs/customers/logitech.svg';
import companyLogo2 from '@assets/imgs/customers/canon-logo.svg';
import companyLogo3 from '@assets/imgs/customers/cloudinary.svg';
import companyLogo4 from '@assets/imgs/customers/logotype-alinea.svg';
import companyLogo5 from '@assets/imgs/customers/cat.svg';
import companyLogo6 from '@assets/imgs/customers/netflix.svg';
import companyLogo7 from '@assets/imgs/customers/dropbox.svg';
import companyLogo8 from '@assets/imgs/customers/trustpilot.svg';
import companyLogo9 from '@assets/imgs/customers/sketch.svg';
import companyLogo10 from '@assets/imgs/customers/ethereum.svg';

import './CustomerGrid.scss';

const gridItems : React.ReactNode[] = [
    <CustomerLogo imgSrc={companyLogo1} imgAlt='Logitech company' />,
    <CustomerLogo imgSrc={companyLogo2} imgAlt='Canon company' />,
    <CustomerLogo imgSrc={companyLogo3} imgAlt='Cloudinary company' />,
    <CustomerLogo imgSrc={companyLogo4} imgAlt='Alinea company' />,
    <CustomerLogo imgSrc={companyLogo5} imgAlt='CAT company' />,
    <CustomerText />,
    <CustomerLogo imgSrc={companyLogo6} imgAlt='Netflix company' />,
    <CustomerLogo imgSrc={companyLogo7} imgAlt='Dropbox company' />,
    <CustomerLogo imgSrc={companyLogo8} imgAlt='Trustpilot company' />,
    <CustomerLogo imgSrc={companyLogo9} imgAlt='Sketch company' />,
    <CustomerLogo imgSrc={companyLogo10} imgAlt='Ethereum company' />,
];

const CustomerGrid: React.FC = () => {
    return(<div className='position-relative'>
             <div className='grid-customer'>
                { gridItems.map(item => <CustomerGridCell key={uuidv4()}>{item}</CustomerGridCell>) }
             </div>
           </div>)
}

export default CustomerGrid;