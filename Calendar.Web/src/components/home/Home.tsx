import Brand from './sections/Brand';
import Business from './sections/Business';
import Services from './sections/Services';
import Benefits from './sections/Benefits';
import Customers from './sections/Customers';
import Testimonies from './sections/Testimonies';
import Faq from './sections/Faq';

import GridBg from './GridBg';

import './Home.scss';

const Home = () => {
    return (<div>
                <Brand />
                <div className='container-fluid container-lg g-0'>
                    <div className='grid-content my-5'>
                        <Business />
                        <Services />
                        <Benefits />
                        <Customers />
                        <Testimonies />
                        <Faq />
                    </div>
                </div>
            </div>);
};

export default Home;
