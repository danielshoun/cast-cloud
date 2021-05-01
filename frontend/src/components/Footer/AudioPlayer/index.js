import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {goToNextSong, setAudioRef, togglePlaying} from "../../../store/audio";
import './AudioPlayer.css';
import ProgressBar from "./ProgressBar";
import PlaybackController from "./PlaybackController";
import VolumeController from "./VolumeController";
import {csrfFetch} from "../../../store/csrf";

export default function AudioPlayer() {
    const audioState = useSelector(state => state.audio);
    const currentEpisode = audioState.queue[audioState.currentTrack];
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const[duration, setDuration] = useState(null);
    const [curTime, setCurTime] = useState(null);
    const [percentListened, setPercentListened] = useState(0);

    useEffect(() => {
        if(audioState.playing && audioRef.current) {
            audioRef.current.play();
        } else if(audioRef.current) {
            audioRef.current.pause();
        }
    }, [audioState.playing])

    useEffect(() => {
        if(!currentEpisode) {
            setPercentListened(0);
            setCurTime(null);
            setDuration(null);
            return;
        }

        if(audioRef.current) {
            const currentAudioRef = audioRef.current;
            dispatch(setAudioRef(currentAudioRef));

            function getTime(time) {
                let hours = Math.floor(time / 3600);
                time = time - hours * 3600;
                let minutes = Math.floor(time / 60);
                let seconds = Math.floor(time - minutes * 60);
                return `${hours < 10 ? '0' + hours.toString(10) : hours}:` +
                    `${minutes < 10 ? '0' + minutes.toString(10) : minutes}:` +
                    `${seconds < 10 ? '0' + seconds.toString(10) : seconds}`;
            }

            function readyPlayerState() {
                setPercentListened(0);
                setCurTime(getTime(currentAudioRef.currentTime));
                setDuration(getTime(currentAudioRef.duration));
                dispatch(togglePlaying(true));
                currentAudioRef.removeEventListener('canplay', readyPlayerState);
            }

            async function nextSong() {
                setPercentListened(0);
                setCurTime(null);
                setDuration(null);
                const body = {
                    played: true
                }
                await csrfFetch(`/api/episodes/${currentEpisode.id}/progress`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                dispatch(goToNextSong());
            }

            function changeDuration() {
                setDuration(getTime(currentAudioRef.duration))
            }

            function updateTime() {
                setCurTime(getTime(currentAudioRef.currentTime));
                setPercentListened((currentAudioRef.currentTime / currentAudioRef.duration) * 100);
            }

            dispatch(togglePlaying(false))
            currentAudioRef.load();
            currentAudioRef.addEventListener('canplay', readyPlayerState);
            currentAudioRef.addEventListener('timeupdate', updateTime)
            currentAudioRef.addEventListener('durationchange', changeDuration);
            currentAudioRef.addEventListener('ended', nextSong);

            return () => {
                currentAudioRef.removeEventListener('durationchange', changeDuration);
                currentAudioRef.removeEventListener('timeupdate', updateTime)
                currentAudioRef.removeEventListener('ended', nextSong);
            }
        }
    }, [currentEpisode, dispatch])

    function playAudio() {
        if(audioState.currentTrack !== null && audioState.playing) {
            dispatch(togglePlaying(false));
        } else if(audioState.currentTrack !== null) {
            dispatch(togglePlaying(true));
        }
    }

    return (
        <div className='audioPlayerContainer'>
            {audioState.currentTrack !== null &&
                <audio ref={audioRef}>
                    <source id='footerPlayer' src={currentEpisode.url}/>
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
        </div>

    )
}