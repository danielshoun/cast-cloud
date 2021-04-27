import {useSelector} from "react-redux";
import './AudioInfo.css';
import {useEffect, useRef} from "react";

export default function AudioInfo() {
    const audioState = useSelector(state => state.audio);
    const textRef = useRef(null);

    if(!audioState.currentTrack) {
        return (
            <>
            </>
        )
    }

    return (
        <div className='audioInfoContainer'>
            <img className='nowPlayingImage' src={audioState.currentTrack.artworkUrl}/>
            <div className='nowPlayingText' ref={textRef}>
                <div className='nowPlayingTitle'>{audioState.currentTrack.title}</div>
                <div className='nowPlayingArtist'>{audioState.currentTrack.podcastTitle}</div>
            </div>
        </div>
    )
}