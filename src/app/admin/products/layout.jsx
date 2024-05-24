import React from 'react'

function Layout({ children }) {
    return (
        <div className='bg-white h-full'>
            {children}
        </div>
    )
}

export default Layout