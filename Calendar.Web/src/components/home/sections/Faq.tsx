import { Accordion } from 'react-bootstrap';

import clockImg from '@assets/imgs/clock_img.svg';

import './Faq.scss';

const Faq = () => {
    return(<>
        <div className='grid-cell-10 sc-faq pe-lg-0'>
            <div className='row'>
                <div className='col-12 col-lg-6'>
                    <h2>
                        <span>Curious about </span>
                        <span className='text-primary'>Chronos</span>
                        <span>?</span>
                    </h2>
                    <div className='mt-5'>
                        <Accordion defaultActiveKey='0'>
                            <Accordion.Item eventKey='0' className='mb-4'>
                                <Accordion.Header>
                                    Can I migrate and sync all my calendars?
                                </Accordion.Header>
                                <Accordion.Body>
                                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='1' className='mb-4'>
                                <Accordion.Header>
                                    Can I migrate and sync all my calendars?
                                </Accordion.Header>
                                <Accordion.Body>
                                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2" className='mb-4'>
                                <Accordion.Header>Accordion Item #2</Accordion.Header>
                                <Accordion.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3" className='mb-4'>
                                <Accordion.Header>Accordion Item #2</Accordion.Header>
                                <Accordion.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4" className='mb-4'>
                                <Accordion.Header>Accordion Item #2</Accordion.Header>
                                <Accordion.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="5" className='mb-4'>
                                <Accordion.Header>Accordion Item #2</Accordion.Header>
                                <Accordion.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
                <div className='d-none d-lg-block col-lg-6 pt-5'>
                    <img className='img-fluid' src={clockImg} alt='' />
                </div>
            </div>
        </div>
    </>)
}

export default Faq;