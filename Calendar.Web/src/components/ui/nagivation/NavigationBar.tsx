import { useEffect, useRef } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import brandLogo from '@assets/imgs/brand_logo.svg';

import './NavigationBar.scss';

const NavigationBar = () => {

    const refNavBar = useRef<HTMLElement | null>(null);

    const scrollHandler = (isExpanded: boolean) => {
        var navbarRef = refNavBar.current;
        if(navbarRef !== null){
            (window.scrollY >= 1 || isExpanded) ? navbarRef.classList.add('bg-scroll') : navbarRef.classList.remove('bg-scroll');
        }
    }

    useEffect(() => {
        if(refNavBar.current !== null){
            window.addEventListener('scroll', () => scrollHandler(false));
        }
    }, []);

    return(<Navbar expand='lg' className='py-3 fixed-top container-fluid' ref={refNavBar} onToggle={(expanded: boolean) => scrollHandler(expanded) }>
            <div className='container'>
                <NavLink className='navbar-brand' to='/'>
                    <img className='img-fluid' src={brandLogo} alt='Chronos logo' />
                </NavLink>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Nav className='align-items-lg-center'>
                        <NavLink className='btn btn-link' to='/'>Home</NavLink>
                        <NavLink className='btn btn-link' to='/dashboard'>Dashboard</NavLink>
                        <NavLink className='btn btn-link' to='/pricing'>Pricing</NavLink>
                        <NavLink className='btn btn-link' to='/about'>About Us</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>)
}

export default NavigationBar;