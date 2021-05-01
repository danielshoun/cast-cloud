import React, {useEffect, useRef, useState} from "react";
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
    const dispatch = useDispatch();
    const [played, setPlayed] = useState(episode.EpisodeProgresses[0]?.played);
    const firstRender = useRef(true);

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

    async function handlePlayedToggle(e) {
        e.stopPropagation();
        setPlayed(prevState => !prevState);
    }

    useEffect(() => {
        if(firstRender.current) firstRender.current = false;
        else {
            async function fetchData() {
                const body = {
                    played
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
            fetchData().then();
        }
    }, [played])

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