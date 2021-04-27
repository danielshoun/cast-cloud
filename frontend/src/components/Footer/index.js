import './Footer.css';
import AudioPlayer from "../Audio";
import {useSelector} from "react-redux";
import React, {useEffect, useRef} from "react";

export default function Footer() {
    const audioState = useSelector(state => state.audio);
    const ref = useRef(null);

    useEffect(() => {
        console.log('Changing audio player');
        ref.current.pause();
        ref.current.load();
        ref.current.addEventListener('canplay', () => {
            ref.current.play();
        })
    }, [audioState.currentTrack?.url])

    return (
        <div id='footer' className='footer'>
            <audio controls ref={ref}>
                <source id='footerPlayer' src={audioState.currentTrack?.url}/>
            </audio>
        </div>
    )
}