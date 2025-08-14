import React from 'react'

function AuthLayout({children} : Readonly<{children: React.ReactNode}>) {
    return (
        <div className="min-h-screen">
            <main className="">
                {children}
            </main>


        </div>
    )
}

export default AuthLayout
