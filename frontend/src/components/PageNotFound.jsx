import React from 'react'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
    const navigate = useNavigate();
  return (
    <div> <h1>404 Page Not Found</h1>
    <button onClick={()=>navigate('/login')}>Login</button>
    </div>
  )
}

export default PageNotFound
