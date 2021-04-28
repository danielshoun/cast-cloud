import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {togglePlaying} from "../../store/audio";
import './AudioPlayer.css';
import ProgressBar from "./ProgressBar";
import PlaybackController from "./PlaybackController";
import VolumeController from "./VolumeController";

export default function AudioPlayer() {
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const[duration, setDuration] = useState(null);
    const [curTime, setCurTime] = useState(null);
    const [percentListened, setPercentListened] = useState(0);

    useEffect(() => {
        if(audioRef.current) {
            const currentAudioRef = audioRef.current;

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
                setCurTime(getTime(currentAudioRef.currentTime));
                setDuration(getTime(currentAudioRef.duration));
                currentAudioRef.play();
                dispatch(togglePlaying(true));
                currentAudioRef.removeEventListener('canplay', readyPlayerState);
            }

            function updateTime(e) {
                setPercentListened(e.target.currentTime / e.target.duration * 100)
                setCurTime(getTime(e.target.currentTime));
            }

            currentAudioRef.pause();
            currentAudioRef.load();
            currentAudioRef.addEventListener('canplay', readyPlayerState);
            currentAudioRef.addEventListener('timeupdate', updateTime);

            return () => {
                currentAudioRef.removeEventListener('timeupdate', updateTime);
            }
        }
    }, [audioState.currentTrack?.url, dispatch])

    function playAudio() {
        if(audioState.currentTrack && audioState.playing) {
            audioRef.current.pause();
            dispatch(togglePlaying(false));
        } else if(audioState.currentTrack) {
            audioRef.current.play()
            dispatch(togglePlaying(true));
        }
    }

    return (
        <div className='audioPlayerContainer'>
            {audioState.currentTrack &&
                <audio ref={audioRef}>
                    <source id='footerPlayer' src={audioState.currentTrack?.url}/>
                </audio>
            }
            <PlaybackController
                playing={audioState.playing}
                playAudio={playAudio}
                audioRef={audioRef}
            />
            <ProgressBar
                duration={duration}
                curTime={curTime}
                percentListened={percentListened}
                audioRef={audioRef}
            />
            <VolumeController audioRef={audioRef}/>
            <i className={`far fa-comment-alt commentButton${audioRef.current ? '' : ' inactiveButton'}`}/>
            <i className={`far fa-list-alt playlistButton${audioRef.current ? '' : ' inactiveButton'}`}/>
        </div>

    )
}