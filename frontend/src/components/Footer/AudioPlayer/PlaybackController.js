import React from "react";
import {useSelector} from "react-redux";

export default function PlaybackController({ playing, playAudio }) {
    const audioState = useSelector(state => state.audio);

    return (
        <>
            {
                playing ?
                    <i className={`fas fa-pause-circle controlButton${audioState.currentTrack !== null ? '' : ' inactiveButton'}`} onClick={playAudio}/> :
                    <i className={`fas fa-play-circle controlButton${audioState.currentTrack !== null ? '' : ' inactiveButton'}`} onClick={playAudio}/>
            }
        </>
    )
}