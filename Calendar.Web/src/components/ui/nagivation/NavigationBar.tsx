import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import brandLogo from '@assets/imgs/brand_logo.svg';

import './NavigationBar.scss';

const NavigationBar = () => {
    return(<Navbar expand='lg' className='py-3 fixed-top container-fluid'>
            <div className='container'>
                <NavLink className='navbar-brand' to='/'>
                    <img className='img-fluid' src={brandLogo} alt='Chronos logo' />
                </NavLink>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Nav className='align-items-lg-center'>
                        <NavLink className='nav-link' to='/'>Home</NavLink>
                        <NavLink className='nav-link' to='/dashboard'>Dashboard</NavLink>
                        <NavLink className='nav-link' to='/pricing'>Pricing</NavLink>
                        <NavLink className='nav-link' to='/about'>About Us</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>)
}

export default NavigationBar;