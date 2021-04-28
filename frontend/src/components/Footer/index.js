import './Footer.css';
import AudioPlayer from "./AudioPlayer";
import AudioInfo from "./AudioInfo";
import AudioPopups from "./AudioPopups";

export default function Footer() {

    return (
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
    )
}