import React, {useRef} from "react";

export default function ProgressBar({duration, curTime, percentListened, audioRef}) {
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
            audioRef.current.currentTime = getClickedTime(e);

            function moveUpdate(e) {
                audioRef.current.currentTime = getClickedTime(e);
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
                        className={`progressKnob${audioRef.current ? '' : ' inactiveKnob'}`}
                        style={{left: `${percentListened - 2}%`}}
                    />
            </div>
            <span className={`barTime${audioRef.current ? '' : ' inactiveTime'}`}>{curTime || '00:00:00'} | {duration || '00:00:00'}</span>
        </div>
    )
}