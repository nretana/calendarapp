import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import NavigationBar from '../nagivation/NavigationBar';

const WideLayout = () => {
    return(<>
            <NavigationBar />
            <main>
                <div className='container-fluid p-0'>
                    <div className='row align-items-center h-100 p-0 g-0'>
                        <Outlet />
                    </div>
                </div>
            </main>
            <Footer />
           </>)
}

export default WideLayout;