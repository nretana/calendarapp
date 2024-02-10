import React from 'react';

type CustomerLogoProps = {
    imgSrc: string,
    imgAlt: string
}

const CustomerLogo: React.FC<CustomerLogoProps> = ({ imgSrc, imgAlt }) => {

    return( <div className='customer-wrapper'>
                <img className='img-fluid' src={imgSrc} alt={imgAlt} loading='lazy' />
            </div>)
}

export default CustomerLogo;