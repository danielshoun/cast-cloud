import './Footer.css';
import AudioPlayer from "./AudioPlayer";

export default function Footer() {

    return (
        <div id='footer' className='footer'>
            <div className='footerDiv'></div>
                <AudioPlayer/>
            <div className='footerDiv'>
                <i className="fab fa-github footerIcon" onClick={() => window.open('https://github.com/danielshoun/cast-cloud', '_blank')}/>
                <i className="fab fa-linkedin footerIcon" onClick={() => window.open('https://www.linkedin.com/in/daniel-shoun/', '_blank')}/>
            </div>
        </div>
    )
}