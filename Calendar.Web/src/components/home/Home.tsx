import Brand from './/brand/Brand';
import Business from './/business/Business';
import Services from './/services/Services';
import Benefits from './/benefits/Benefits';
import Customers from './/customer/Customers';
import Testimonies from './/testimonies/Testimonies';
import Faq from './/faq/Faq';

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
