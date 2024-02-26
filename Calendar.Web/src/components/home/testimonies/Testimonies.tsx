import Slider from './slider/Slider';

const Testimonies = () => {
  return (
    <>
      <div className='grid-cell-8'></div>
      <div className='grid-cell-9'>
        <h2 className='text-center text-lg-end'>
          <span>People who love </span>
          <span className='text-primary'>Chronos</span>
        </h2>
        <Slider />
      </div>
    </>
  );
};

export default Testimonies;
