import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";

export default function VolumeController({audioRef}) {
    const audioState = useSelector(state => state.audio);
    const [showingSlider, setShowingSlider] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const sliderRef = useRef();

    function getClickedVolume(e) {
        const barStart = sliderRef.current.getBoundingClientRect().bottom + window.scrollY;
        const barHeight = sliderRef.current.offsetHeight;
        const clickPos = e.pageY - barStart;
        const volPerPixel = 1 / barHeight;
        return -volPerPixel * clickPos;
    }

    function handleVolumeDrag(e) {
        if(audioRef.current) {
            if(isMuted) setIsMuted(false)
            const clickVol = getClickedVolume(e);
            if(clickVol >= 0 && clickVol <= 1) {
                audioRef.current.volume = getClickedVolume(e);
                setCurrentVolume(audioRef.current.volume * 100);
            }

            function moveUpdate(e) {
                if(sliderRef.current) {
                    const dragVol = getClickedVolume(e);
                    if(dragVol >= 0 && dragVol <= 1) {
                        audioRef.current.volume = dragVol;
                        setCurrentVolume(audioRef.current.volume * 100);
                    }
                }
            }

            document.addEventListener('mousemove', moveUpdate);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', moveUpdate)
            })
        }
    }

    function toggleMute() {
        if(audioRef.current) {
            if(isMuted) {
                audioRef.current.volume = currentVolume / 100;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    }

    return (
        <div
            className='volumeControllerContainer'
            onMouseOver={audioState.currentTrack === null ? undefined : (() => setShowingSlider(true))}
            onMouseLeave={() => setShowingSlider(false)}
        >
            <div className='volumeButtonContainer'>
                {isMuted ?
                    <i className={`fas fa-volume-mute volumeButton${audioState.currentTrack !== null ? '' : ' inactiveButton'}`} onClick={toggleMute}/> :
                    <i className={`fas fa-volume-up volumeButton${audioState.currentTrack!== null ? '' : ' inactiveButton'}`} onClick={toggleMute}/>
                }
            </div>
            {showingSlider ? (
                <div className='sliderContainer'>
                    <div
                        className='volumeSlider'
                        ref={sliderRef}
                        onMouseDown={handleVolumeDrag}
                        style={{background: `linear-gradient(to top, #f35b04 ${isMuted ? 0: currentVolume}%, #1e1e24 0`}}>
                    <span
                        className='volumeKnob'
                        style={{bottom: `${isMuted ? -95 : currentVolume - 100 + 5}%`}}
                    />
                    </div>
                </div>
            ) : null}
        </div>
    )
}