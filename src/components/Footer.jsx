import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                {/* CTA Banner */}
                <div className="footer__cta">
                    <div className="footer__cta-content">
                        <h3 className="footer__cta-title">Are You a Lawyer?</h3>
                        <p className="footer__cta-text">
                            Grow your practice with Find Lawyer Nepal. Claim your free profile and reach millions of potential clients.
                        </p>
                    </div>
                    <button className="btn btn-accent btn-lg">Claim Your Profile</button>
                </div>

                {/* Footer Links */}
                <div className="footer__grid">
                    <div className="footer__col">
                        <Link to="/" className="footer__logo">Find Lawyer Nepal</Link>
                        <p className="footer__about">
                            Find Lawyer Nepal connects people with the right lawyers. Search for attorneys, get free legal advice, and research legal topics.
                        </p>
                        <div className="footer__socials">
                            <a href="#" className="footer__social-link" aria-label="Facebook"><FaFacebookF /></a>
                            <a href="#" className="footer__social-link" aria-label="Twitter"><FaTwitter /></a>
                            <a href="#" className="footer__social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
                            <a href="#" className="footer__social-link" aria-label="Instagram"><FaInstagram /></a>
                            <a href="#" className="footer__social-link" aria-label="YouTube"><FaYoutube /></a>
                        </div>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">For Clients</h4>
                        <ul className="footer__links">
                            <li><Link to="/search">Find a Lawyer</Link></li>
                            <li><Link to="/ask">Ask a Lawyer</Link></li>
                            <li><Link to="/search?type=research">Research Legal Topics</Link></li>
                            <li><Link to="/search?type=guides">Legal Guides</Link></li>
                            <li><Link to="/search?type=reviews">Lawyer Reviews</Link></li>
                            <li><Link to="/ask">Free Legal Advice</Link></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">For Lawyers</h4>
                        <ul className="footer__links">
                            <li><a href="#">Find Lawyer Nepal for Lawyers</a></li>
                            <li><a href="#">Claim Your Profile</a></li>
                            <li><a href="#">Find Lawyer Nepal Legal Services</a></li>
                            <li><a href="#">Advertising</a></li>
                            <li><a href="#">Lawyer Directory</a></li>
                            <li><a href="#">Pricing</a></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Legal Topics</h4>
                        <ul className="footer__links">
                            <li><Link to="/search?topic=family">Family Law</Link></li>
                            <li><Link to="/search?topic=criminal">Criminal Defense</Link></li>
                            <li><Link to="/search?topic=personal-injury">Personal Injury</Link></li>
                            <li><Link to="/search?topic=dui">DUI / DWI</Link></li>
                            <li><Link to="/search?topic=immigration">Immigration</Link></li>
                            <li><Link to="/search?topic=bankruptcy">Bankruptcy</Link></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">About Find Lawyer Nepal</h4>
                        <ul className="footer__links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Partner With Us</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Help Center</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer__bottom">
                    <p className="footer__copyright">
                        © 2026 Find Lawyer Nepal. All rights reserved. Locally developed for Nepal.
                    </p>
                    <div className="footer__legal-links">
                        <a href="#">Terms of Use</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Cookie Policy</a>
                        <a href="#">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
