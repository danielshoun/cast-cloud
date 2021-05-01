import './Footer.css';
import AudioPlayer from "./AudioPlayer";
import AudioInfo from "./AudioInfo";
import AudioPopups from "./AudioPopups";
import {Link} from "react-router-dom";

export default function Footer() {

    return (
        <>
            <div className='aboutInfo'>
                <div>
                    Created by Danny Shoun.
                    <Link to='https://github.com/danielshoun/cast-cloud'><i className="fab fa-github aboutIcon"/></Link>
                    <Link to='https://www.linkedin.com/in/daniel-shoun/'><i className="fab fa-linkedin aboutIcon"/></Link>
                </div>
                <div>
                </div>
                <div><a href='mailto:danielshoun@protonmail.com' className='emailLink'>danielshoun@protonmail.com</a></div>
            </div>
            <div className='push'/>
            <div id='footer' className='footer'>
                <div className='footerDiv'>
                    <AudioInfo/>
                </div>
                <div className='footerDiv'>
                    <AudioPlayer/>
                </div>
                <div className='footerDiv rightFooter'>
                    <AudioPopups/>
                </div>
            </div>
        </>
    )
}