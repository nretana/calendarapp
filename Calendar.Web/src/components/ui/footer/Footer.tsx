import BrandLogo from '@assets/imgs/brand_logo.svg';
import xIcon from '@assets/imgs/x_icon.svg';
import instagramIcon from '@assets/imgs/instagram_icon.svg';
import facebookIcon from '@assets/imgs/facebook_icon.svg';

import { Button } from 'react-bootstrap';
import { Input, TextField } from 'react-aria-components';

import './Footer.scss';

const Footer = () => {
    return(<footer className='footer container-fluid container-lg'>
        <div className='position-relative'>
        <div className='row justify-content-between align-items-end'>
            <div className='col'>
                <a href='# '>
                    <img className='img-fluid brand-logo' src={BrandLogo} alt='Chronos logo' />
                </a>
            </div>
            <div className='col text-end'>
                <a href='# ' className='me-3'><img src={xIcon} alt='X logo' loading='lazy' /></a>
                <a href='# ' className='me-3'><img src={instagramIcon} alt='Instagram logo' loading='lazy' /></a>
                <a href='# ' className='me-3'><img src={facebookIcon} alt='Facebook logo' loading='lazy' /></a>
            </div>
        </div>
        <hr></hr>
        <div className='row g-0'>
            <div className='col-12 col-xl-7'>
                <div className='footer-navbar row g-0'>
                    <div className='col-12 col-md-3'>
                        <h4>Company</h4>
                        <ul>
                            <li><a href='# '>About us</a></li>
                            <li><a href='# '>Chronos team</a></li>
                        </ul>
                    </div>
                    <div className='col-12 col-md-3'>
                        <h4>Resources</h4>
                        <ul>
                            <li><a href='# '>FAQs</a></li>
                            <li><a href='# '>Privacy Policy</a></li>
                            <li><a href='# '>Terms and Conditions</a></li>
                            <li><a href='# '>Cookie Settings</a></li>
                        </ul>
                    </div>
                    <div className='col-12 col-md-3'>
                        <h4>Product</h4>
                        <ul>
                            <li><a href='# '>Pricing</a></li>
                        </ul>
                    </div>
                    <div className='col-12 col-md-3'>
                        <h4>Contact Us</h4>
                        <ul>
                            <li><a href='# '>Technical Support</a></li>
                            <li><a href='# '>Contact Sales</a></li>
                            <li><a href='# '>Education & Training</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='col-12 col-xl-5 text-lg-end'>
                <div className='footer-subscription'>
                    <h4>Subscribe to Our Newsletter</h4>
                    <TextField>
                        <div className='d-flex'>
                            <Input className='form-control input-subscribe' />
                            <Button className='btn-subscribe' type='button' variant='dark'>Subscribe</Button>
                        </div>
                    </TextField>
                </div>
            </div>
        </div>
        <div className='text-center mt-5'>© Chronos LLC {new Date().getFullYear()}</div>
        </div>
    </footer>)
}

export default Footer;