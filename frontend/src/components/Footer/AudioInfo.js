import {useSelector} from "react-redux";
import './AudioInfo.css';
import {useEffect, useState} from "react";

export default function AudioInfo() {
    const audioState = useSelector(state => state.audio);
    const [overflowAmount, setOverflowAmount] = useState(0);

    useEffect(() => {
        if(audioState.currentTrack && audioState.currentTrack.title.length > 50) {
            setOverflowAmount((audioState.currentTrack.title.length - 50) * 2);
        } else {
            setOverflowAmount(0);
        }
    }, [audioState.currentTrack])

    if(!audioState.currentTrack) {
        return (
            <>
            </>
        )
    }

    return (
        <div className='audioInfoContainer'>
            {overflowAmount > 0 &&
                <style>
                    {
                        `@keyframes bounce {
                            0% {transform: translateX(0%)}
                            50% {transform: translateX(0%)}
                            75% {transform: translateX(-${overflowAmount}%)}
                            100% {transform: translateX(0%)}
                        }`
                    }
                </style>}
            <img alt='Album Artwork' className='nowPlayingImage' src={audioState.currentTrack.artworkUrl}/>
            <div className='nowPlayingText'>
                <div className='nowPlayingTitle'>{audioState.currentTrack.title}</div>
                <div className='nowPlayingArtist'>{audioState.currentTrack.podcastTitle}</div>
            </div>
        </div>
    )
}