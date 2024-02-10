
type ErrorContentProps = {
    title?: string,
    message?: string
}

const ErrorContent : React.FC<ErrorContentProps> = ({ title = 'Oops!', message = 'Something went wrong' }) => {
    return(<>
            <div className='container vh-100'>
                <div className='row justify-content-center align-items-center h-100'>
                    <div className='col text-center'>
                        <h1>{title}</h1>
                        <p>{message}</p>
                    </div>
                </div>
            </div>
           </>)
}

export default ErrorContent;