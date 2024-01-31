import React, { Profiler } from 'react';

import CalendarPicker from './datePicker/CalendarPicker';
import CalendarBoard from './board/calendarBoard/CalendarBoard';

import brandLogo from '@assets/imgs/brand_logo_light.svg';
import './Dashboard.scss';

const Dashboard : React.FC = () => {
    return(
        <div className='dashboard-section p-3'>
            <div className='row align-items-stretch g-0'>
                <div className='col-12 col-lg-3'>
                    <div className='side-content rounded-start'>
                        <div className='d-flex align-items-center mb-4'>
                            <a href='/'>
                                <img className='brand-logo-light' src={brandLogo} alt='brand logo' />
                            </a>
                        </div>
                        <CalendarPicker />
                    </div>
                </div>
                <div className='col-12 col-lg-9'>
                {/* <Profiler id="TestProfiler" onRender={(id, phase, actualDuration, baseDuration) => console.log(id, phase, actualDuration, baseDuration)}> */}
                    <CalendarBoard />
              {/*  </Profiler> */}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;