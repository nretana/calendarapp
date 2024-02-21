import { Outlet } from 'react-router-dom';

import './DefaultLayout.scss';

const DefaulLayout = () => {
    return(<>
        <main className='default-layout'>
            <div className='container-fluid vh-100 p-0 g-0'>
                <div className='row align-items-center h-100 g-0'>
                    <Outlet />
                </div>
            </div>
        </main>
       </>)
}

export default DefaulLayout;