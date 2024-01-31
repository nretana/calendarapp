import questionIcon from '@assets/imgs/question-circle.svg';
import gearIcon from '@assets/imgs/gear.svg';

import './CalendarBoardHeader.scss';

const CalendarBoardHeader = () => {
    return(<>
            <div className='calendar-board-header'>
                {<h1 className='mb-0'>Calendar Appointments</h1>}
                <div className='d-flex align-items-center'>
                    <a className='bg-circle me-3' href="# ">
                        <img src={questionIcon} width={30} height={30} alt='Configuration' />
                    </a>
                    <a className='bg-circle me-3' href="# ">
                        <img src={gearIcon} width={30} height={30} alt='Help' />
                    </a>
                    <div className='user-menu'>

                    </div>
                </div>
            </div>
          </>
    )
}

export default CalendarBoardHeader;