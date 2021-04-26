import React from "react";

import Song from "./Song";
import Play from "./Play";
import Pause from "./Pause";
import Bar from "./Bar";

import useAudioPlayer from './useAudioPlayer';
import './AudioPlayer.css';
import {useSelector} from "react-redux";

export default function AudioPlayer() {
    const audioState = useSelector(state => state.audio);
    const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer();

    return (
        <div className="player">
            <audio id="audio">
                <source src={audioState.currentTrack?.url} type={audioState.currentTrack?.type}/>
                Your browser does not support the <code>audio</code> element.
            </audio>
            {/*<Song songName="Instant Crush" songArtist="Daft Punk ft. Julian Casablancas" />*/}
            <div className="controls">
                {playing ?
                    <Pause handleClick={() => setPlaying(false)} /> :
                    <Play handleClick={() => setPlaying(true)} />
                }
            </div>
            <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)}/>
        </div>
    );
}