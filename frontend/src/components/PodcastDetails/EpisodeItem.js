import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {addToQueue, changeTrack, togglePlaying} from "../../store/audio";

export default function EpisodeItem({activeEpisode, handleActive, episode, podcastData}) {
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();

    function playTrack(e, episode) {
        e.stopPropagation();
        if(audioState.queue[audioState.currentTrack]?.url === episode.url) {
            dispatch(togglePlaying(true));
        } else {
            dispatch(changeTrack({
                podcastTitle: podcastData.title,
                artworkUrl: podcastData.artworkUrl,
                itunesId: podcastData.itunesId,
                ...episode
            }))
        }
    }

    function pauseTrack(e) {
        e.stopPropagation();
        dispatch(togglePlaying(false));
    }

    function addTrack(e, episode) {
        e.stopPropagation();
        if(!audioState.queue.find(el => el.guid === episode.guid)) {
            dispatch(addToQueue({
                podcastTitle: podcastData.title,
                artworkUrl: podcastData.artworkUrl,
                itunesId: podcastData.itunesId,
                ...episode
            }));
        }
    }

    return (
        <div className='episodeContainer'>
            <div className={`episodeHeader${activeEpisode === episode.guid ? ' activeEpisode' : ''}`} onClick={() => handleActive(episode)}>
                            <span className='episodeTitle'>
                                {activeEpisode === episode.guid ? <i className="fas fa-angle-down titleCaret"/> :
                                    <i className="fas fa-angle-right titleCaret"/> }
                                {episode.title}
                            </span>
                <div className='episodeControls'>
                    {audioState.queue[audioState.currentTrack]?.url === episode.url && audioState.playing ?
                        <i className={`fas fa-pause-circle episodeButton`} onClick={(e) => pauseTrack(e)}/> :
                        <i className={`fas fa-play-circle episodeButton`} onClick={(e) => playTrack(e, episode)}/>}
                    <i className="fas fa-plus-circle episodeButton" onClick={(e) => addTrack(e, episode)}/>
                </div>

            </div>
            {activeEpisode === episode.guid && (
                <div>
                    <div className='episodeDescription'>{episode.description || episode.description}</div>
                </div>
            )}
        </div>
    )
}