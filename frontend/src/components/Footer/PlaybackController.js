import React from "react";

export default function PlaybackController({ playing, playAudio }) {
    return (
        <>
            {
                playing ?
                    <i className='fas fa-pause-circle controlButton' onClick={playAudio}/> :
                    <i className='fas fa-play-circle controlButton' onClick={playAudio}/>
            }
        </>
    )
}