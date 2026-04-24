import { Link } from 'react-router-dom'

function PageNotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <br></br>
            <p>Victor forgot to make this page...</p>
            <br></br>
            <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                Return to Main Page
            </Link>
        </div>
    )}

export default PageNotFound