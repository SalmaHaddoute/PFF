import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <div>
        <footer class="py-4 mt-auto">
            <div class="container-fluid px-4">
                <div class="d-flex align-items-center justify-content-between small">
                    <div class="text-muted text-dark">Copyright &copy; Blacklist.en</div>
                    <div>
                        <a href="#" class="text-warning">Privacy Policy</a>
                        &middot;
                        <a href="#" class="text-warning">Terms &amp; Conditions</a>
                    </div>
                </div>
            </div>
    </footer>
        
        </div>
    )
}

export default Footer
