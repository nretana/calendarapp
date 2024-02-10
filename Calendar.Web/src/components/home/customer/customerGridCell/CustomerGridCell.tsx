import React from 'react';
import './CustomerGridCell.scss';

type CustomerGridCellProps = {
    children: React.ReactNode
}

const CustomerGridCell : React.FC<CustomerGridCellProps> = ({ children }) => {
    return(<div className='customer-cell'>
            {children}
           </div>)
}

export default CustomerGridCell;