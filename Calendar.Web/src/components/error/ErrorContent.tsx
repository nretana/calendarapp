
import './ErrorContent.scss';

type ErrorContentProps = {
    status?: number,
    title?: string,
    message?: string
}

const ErrorContent : React.FC<ErrorContentProps> = ({ status = '404', 
                                                      title = 'Page not found', 
                                                      message = 'The page you are looking for was removed or temporarily unavailable.' }) => {
    return(<>
            <div className='container-fluid g-0 error-content'>
                <div className='container h-100'>
                    <div className='row g-0 align-items-center h-100'>
                        <div className='col-12 col-md-8 col-lg-5'>
                            <h1 className='title'>{status}</h1>
                            <span className='sub-title'>{title}</span>
                            <p className='message'>{message}</p>
                            <a href='/' className='btn btn-dark mt-4'>Back to Homepage</a>
                        </div>
                    </div>
                </div>
            </div>
           </>)
}

export default ErrorContent;