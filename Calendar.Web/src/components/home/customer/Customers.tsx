import CustomerGrid from './customerGrid/CustomerGrid';

import './Customer.scss';

const Customers: React.FC = () => {
  return (
      <div className='grid-cell-7 text-center sc-customer'>
        <h2>
          <span className='text-primary ms-2'>Everything </span>
          <span>you are looking for</span>
        </h2>
        <p className='mb-0'>Over 2+ million people and companies rely on Chronos to collaborate and get work done.</p>
        <CustomerGrid />
      </div>
  );
};

export default Customers;
