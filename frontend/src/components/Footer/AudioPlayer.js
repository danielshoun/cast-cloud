import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {togglePlaying} from "../../store/audio";
import './AudioPlayer.css';
import ProgressBar from "./ProgressBar";

export default function AudioPlayer() {
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const[duration, setDuration] = useState(null);
    const [curTime, setCurTime] = useState(null);
    const [percentListened, setPercentListened] = useState(0);

    useEffect(() => {
        function getTime(time) {
            let hours = Math.floor(time / 3600);
            time = time - hours * 3600;
            let minutes = Math.floor(time / 60);
            let seconds = Math.floor(time - minutes * 60);
            let timeString = `${hours < 10 ? '0' + hours.toString(10) : hours}:` +
                `${minutes < 10 ? '0' + minutes.toString(10) : minutes}:` +
                `${seconds < 10 ? '0' + seconds.toString(10) : seconds}`;
            setCurTime(timeString);
            return timeString;
        }

        function readyPlayerState() {
            setPercentListened(0);
            setCurTime(getTime(audioRef.current.currentTime));
            setDuration(getTime(audioRef.current.duration));
            audioRef.current.play();
            dispatch(togglePlaying(true));
            audioRef.current.removeEventListener('canplay', readyPlayerState);
        }

        function updateTime(e) {
            setPercentListened(e.target.currentTime / e.target.duration * 100)
            setCurTime(getTime(e.target.currentTime));
        }

        audioRef.current.pause();
        audioRef.current.load();
        audioRef.current.addEventListener('canplay', readyPlayerState);
        audioRef.current.addEventListener('timeupdate', updateTime);

        return () => {
            audioRef.current.removeEventListener('timeupdate', updateTime);
        }
    }, [audioState.currentTrack?.url, dispatch])

    function playAudio() {
        if(audioState.playing) {
            audioRef.current.pause();
            dispatch(togglePlaying(false));
        } else {
            audioRef.current.play()
            dispatch(togglePlaying(true));
        }
    }





    return (
        <div className='audioPlayerContainer'>
            <audio controls ref={audioRef}>
                <source id='footerPlayer' src={audioState.currentTrack?.url}/>
            </audio>
            {audioState.playing ? <i className='fas fa-pause-circle controlButton' onClick={playAudio}/>
                : <i className='fas fa-play-circle controlButton' onClick={playAudio}/>
            }
            <ProgressBar duration={duration} curTime={curTime} percentListened={percentListened} audioRef={audioRef}/>
            <i className="fas fa-volume-up volumeButton"/>
        </div>

    )
}