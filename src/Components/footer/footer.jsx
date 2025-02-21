
import './footer.css';
import x from '../../assets/x.png';
import insta from '../../assets/insta.png';
import fb from '../../assets/fb.png';
const Footer = () => {

    return (
       <div className="footer">
        <div className="sb__footer section__padding">
            <div className="sb__footer-links">
              <div className="sb__footer-links-div">
                <h4>AI SOCCER</h4>

              </div>
              <div className="sb__footer-links-div">
                <h4>Helpful Links</h4>
                <a href="/About-AI-Soccer-Pro">
                    <p>About Us</p>
                </a>
                <a href="/Contact">
                    <p>Contact Us</p>
                </a>
                <a href="/termsandconditions">
                    <p>Terms and Conditions</p>
                </a>
                <a href="/privacypolicy">
                    <p>Privacy Policy</p>
                </a>
                
              </div>
              <div className="sb__footer-links-div">
                <h4>Stay Connected</h4>
                <div className="socialmedia">
                   <a href="https://x.com/RHU_Lebanon"><p ><img src={x} alt="" />X</p> </a>
                    <a href="https://www.facebook.com/RHU.Lebanon"><p><img src={fb} alt="" />Facebook</p></a>
                    <a href="https://www.instagram.com/rhu.lebanon/"><p><img src={insta} alt="" />Instagram</p> </a>
                </div>
                
                
              </div>
            </div>
            <hr />
            <div className="sb__footer-below">
                <div className="sb__footer-copyright">
                    <p>
                        @{new Date().getFullYear()} CodeInn. All right reserved.
                    </p>
                </div>
                <div className="sb__footer-below-links">
                    <a href="/termsandconditions"><div><p>Terms & Conditions</p></div></a>
                    <a href="/privacypolicy"><div><p>Privacy</p></div></a>
                </div>
            </div>
        </div>
       </div>
    );
}

export default Footer;