import React from "react";

export default function PlaybackController({ playing, playAudio, audioRef }) {
    return (
        <>
            {
                playing ?
                    <i className={`fas fa-pause-circle controlButton${audioRef.current ? '' : ' inactiveButton'}`} onClick={playAudio}/> :
                    <i className={`fas fa-play-circle controlButton${audioRef.current ? '' : ' inactiveButton'}`} onClick={playAudio}/>
            }
        </>
    )
}