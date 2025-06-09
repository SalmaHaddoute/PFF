import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <div>
        <footer className="py-4 mt-auto">
            <div className="container-fluid px-4">
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted text-dark">Copyright &copy; Blacklist.en</div>
                    <div>
                        <a href="#" className="text-warning">Privacy Policy</a>
                        &middot;
                        <a href="#" className="text-warning">Terms &amp; Conditions</a>
                    </div>
                </div>
            </div>
    </footer>
        
        </div>
    )
}

export default Footer
