import { Accordion } from 'react-bootstrap';

import clockImg from '@assets/imgs/clock_img.svg';

import './Faq.scss';

const Faq = () => {
    return(<>
        <div className='grid-cell-10 sc-faq pe-lg-0'>
            <div className='row'>
                <div className='col-12 col-lg-6 faq-content'>
                    <h2>
                        <span>Curious about </span>
                        <span className='text-primary'>Chronos</span>
                        <span>?</span>
                    </h2>
                    <div className='mt-5'>
                        <Accordion defaultActiveKey='0'>
                            <Accordion.Item eventKey='0' className='mb-4'>
                                <Accordion.Header> <span className='me-2'>Sed ut perspiciatis unde omnis iste natus error?</span></Accordion.Header>
                                <Accordion.Body>
                                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='1' className='mb-4'>
                                <Accordion.Header><span className='me-2'>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium?</span></Accordion.Header>
                                <Accordion.Body>
                                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2" className='mb-4'>
                                <Accordion.Header><span className='me-2'>Sed ut perspiciatis unde omnis iste natus error?</span></Accordion.Header>
                                <Accordion.Body>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3" className='mb-4'>
                                <Accordion.Header><span className='me-2'>Sed ut perspiciatis unde omnis iste natus error?</span></Accordion.Header>
                                <Accordion.Body>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4" className='mb-4'>
                                <Accordion.Header><span className='me-2'>Sed ut perspiciatis unde omnis iste natus error?</span></Accordion.Header>
                                <Accordion.Body>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="5" className='mb-4'>
                                <Accordion.Header><span className='me-2'>Sed ut perspiciatis unde omnis iste natus error?</span></Accordion.Header>
                                <Accordion.Body>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
                <div className='d-none d-lg-block col-lg-6 img-content'>
                    <img className='img-fluid' src={clockImg} alt='' loading='lazy' />
                </div>
            </div>
        </div>
    </>)
}

export default Faq;