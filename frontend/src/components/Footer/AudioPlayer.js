import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {togglePlaying} from "../../store/audio";
import './AudioPlayer.css';

export default function AudioPlayer() {
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current.pause();
        audioRef.current.load();
        audioRef.current.addEventListener('canplay', () => {
            audioRef.current.play();
            dispatch(togglePlaying(true));
        })
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
        </div>

    )
}