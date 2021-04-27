import {useSelector} from "react-redux";
import './AudioInfo.css';
import {useEffect, useRef, useState} from "react";

export default function AudioInfo() {
    const audioState = useSelector(state => state.audio);
    const [overflowAmount, setOverflowAmount] = useState(0);
    const textRef = useRef(null);
    const titleRef = useRef(null);

    function calcOverflowAmount() {
        if(titleRef.current) console.log(titleRef.current.scrollWidth, textRef.current.clientWidth);
        if(titleRef.current && titleRef.current.scrollWidth > textRef.current.clientWidth) {
            setOverflowAmount((titleRef.current.scrollWidth - textRef.current.clientWidth) + 10);
        } else {
            setOverflowAmount(0);
        }
    }

    useEffect(calcOverflowAmount, [audioState.currentTrack, titleRef.current, calcOverflowAmount])

    window.addEventListener('resize', calcOverflowAmount);

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
                            75% {transform: translateX(-${overflowAmount}px)}
                            100% {transform: translateX(0%)}
                        }`
                    }
                </style>}
            <img alt='Album Artwork' className='nowPlayingImage' src={audioState.currentTrack.artworkUrl}/>
            <div className='nowPlayingText' ref={textRef}>
                <div className='nowPlayingTitle' ref={titleRef}>{audioState.currentTrack.title}</div>
                <div className='nowPlayingArtist'>{audioState.currentTrack.podcastTitle}</div>
            </div>
        </div>
    )
}