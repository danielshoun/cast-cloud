import React, {useRef} from "react";
import {useSelector} from "react-redux";

export default function ProgressBar({duration, curTime, percentListened, audioRef}) {
    const audioState = useSelector(state => state.audio);
    const barRef = useRef(null);

    function getClickedTime(e) {
        const barStart = barRef.current.getBoundingClientRect().left + window.scrollX;
        const barWidth = barRef.current.offsetWidth;
        const clickPos = e.pageX - barStart;
        const timePerPixel = audioRef.current.duration / barWidth;
        return timePerPixel * clickPos;
    }

    function handleTimeDrag(e) {
        if(audioRef.current) {
            let clickedTime = getClickedTime(e);
            if(clickedTime >= 0 && clickedTime < audioRef.current.duration) {
                audioRef.current.currentTime = getClickedTime(e);
            }
            function moveUpdate(e) {
                let clickedTime = getClickedTime(e);
                if(clickedTime >= 0 && clickedTime < audioRef.current.duration) {
                    audioRef.current.currentTime = getClickedTime(e);
                }
            }

            document.addEventListener('mousemove', moveUpdate);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', moveUpdate);
            })
        }
    }

    return (
        <div className='bar'>
            <div
                className='barProgress'
                ref={barRef}
                onMouseDown={handleTimeDrag}
                style={{background: `linear-gradient(to right, #f35b04 ${percentListened}%, #1e1e24 0`}}>
                    <span
                        className={`progressKnob${audioState.currentTrack?.url ? '' : ' inactiveKnob'}`}
                        style={{left: `${percentListened - 2}%`}}
                    />
            </div>
            <span className={`barTime${audioState.currentTrack?.url ? '' : ' inactiveTime'}`}>{curTime || '00:00:00'} | {duration || '00:00:00'}</span>
        </div>
    )
}