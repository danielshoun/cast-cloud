import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addToQueue, changeTrack, togglePlaying} from "../../store/audio";
import {csrfFetch} from "../../store/csrf";

export function PlayedButton({ played, handlePlayedToggle }) {
    return (
        <>
            {played ?
                (<i
                    className="far fa-eye episodeButton"
                    onClick={(e) => handlePlayedToggle(e)}
                    onMouseOver={(e) => e.target.classList = 'far fa-eye-slash episodeButton'}
                    onMouseLeave={(e) => e.target.classList = 'far fa-eye episodeButton'}
                />) :
                (<i
                    className="far fa-eye-slash episodeButton"
                    onClick={(e) => handlePlayedToggle(e)}
                    onMouseOver={(e) => e.target.classList = 'far fa-eye episodeButton'}
                    onMouseLeave={(e) => e.target.classList = 'far fa-eye-slash episodeButton'}
                />)}
        </>
    )
}

export default function EpisodeItem({activeEpisode, handleActive, episode, podcastData, modifyEpisodeProgress}) {
    const audioState = useSelector(state => state.audio);
    const currentEpisode = audioState.queue[audioState.currentTrack];
    const dispatch = useDispatch();
    const [played, setPlayed] = useState(episode.EpisodeProgresses[0]?.played);

    useEffect(() => {
        setPlayed(episode.EpisodeProgresses[0]?.played);
    }, [episode.EpisodeProgresses])

    useEffect(() => {
        if(currentEpisode?.id === episode.id && audioState.currentAudioRef) {
            function handleEnd() {
                setPlayed(true);
                modifyEpisodeProgress({...(episode.EpisodeProgresses[0]), played: true});
            }
            audioState.currentAudioRef.addEventListener('ended', handleEnd);
            return () => audioState.currentAudioRef.removeEventListener('ended', handleEnd);
        }
    }, [audioState.currentAudioRef, currentEpisode, episode.id, episode.EpisodeProgresses, modifyEpisodeProgress])

    function playTrack(e, episode) {
        e.stopPropagation();
        if(currentEpisode?.url === episode.url) {
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

    async function handlePlayedToggle(e) {
        e.stopPropagation();
        const newPlayed = !played;
        setPlayed(newPlayed);
        const body = {
            played: newPlayed
        }
        const res = await csrfFetch(`/api/episodes/${episode.id}/progress`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        modifyEpisodeProgress(data);
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
                    {currentEpisode?.url === episode.url && audioState.playing ?
                        <i className={`fas fa-pause-circle episodeButton`} onClick={(e) => pauseTrack(e)}/> :
                        <i className={`fas fa-play-circle episodeButton`} onClick={(e) => playTrack(e, episode)}/>}
                    <i className="fas fa-plus-circle episodeButton" onClick={(e) => addTrack(e, episode)}/>
                    <PlayedButton played={played} handlePlayedToggle={handlePlayedToggle}/>
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