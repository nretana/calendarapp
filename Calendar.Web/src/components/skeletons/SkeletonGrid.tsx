
import './SkeletonGrid.scss';

const SkeletonGrid: React.FC = () => {
    return(<>
            <div className='skeleton grid'>
                {Array(168).fill(0).map((item, index) => <div key={`sk_grid_cell_${index}`} className='grid-cell'></div>) }
            </div>
          </>)
}

export default SkeletonGrid;