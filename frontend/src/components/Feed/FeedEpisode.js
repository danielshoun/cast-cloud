import {PlayedButton} from "../PodcastDetails/EpisodeItem";
import React, {useEffect, useState} from "react";
import {addToQueue, changeTrack, togglePlaying} from "../../store/audio";
import {useDispatch, useSelector} from "react-redux";
import {csrfFetch} from "../../store/csrf";

export default function FeedEpisode({deletePoint, podcast, episode, modifyEpisodeProgress}) {
    const audioState = useSelector(state => state.audio);
    const currentEpisode = audioState.queue[audioState.currentTrack];
    const dispatch = useDispatch();
    const [played, setPlayed] = useState(episode.EpisodeProgresses[0]?.played)

    useEffect(() => {
        setPlayed(episode.EpisodeProgresses[0]?.played)
    }, [episode.EpisodeProgresses])

    useEffect(() => {
        if(currentEpisode?.id === episode.id && audioState.currentAudioRef) {
            function handleEnd() {
                setPlayed(true);
                modifyEpisodeProgress({...(episode.EpisodeProgresses[0]), played: true}, deletePoint);
            }
            audioState.currentAudioRef.addEventListener('ended', handleEnd);
            return () => audioState.currentAudioRef.removeEventListener('ended', handleEnd);
        }
    }, [audioState.currentAudioRef, currentEpisode, episode.id, deletePoint, episode.EpisodeProgresses, modifyEpisodeProgress])

    function playTrack(e, episode) {
        e.stopPropagation();
        if(currentEpisode?.url === episode.url) {
            dispatch(togglePlaying(true));
        } else {
            dispatch(changeTrack({
                podcastTitle: podcast.title,
                artworkUrl: podcast.artworkUrl,
                itunesId: podcast.itunesId,
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
                podcastTitle: podcast.title,
                artworkUrl: podcast.artworkUrl,
                itunesId: podcast.itunesId,
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
        modifyEpisodeProgress(data, deletePoint);
    }

    return (
        <div className='feedEpisodeContainer'>
            <div className='feedEpisodeStatic'>
                <img alt={podcast.title} className='feedEpisodeImage' src={podcast.artworkUrl}/>
                <div className='feedEpisodeInfo'>
                    <div className='feedEpisodeTitle'>{episode.title}</div>
                    <div className='feedEpisodeArtist'>{podcast.title}</div>
                </div>
            </div>
            <div className='feedEpisodeActions'>
                {currentEpisode?.url === episode.url && audioState.playing ?
                    <i className={`fas fa-pause-circle episodeButton`} onClick={(e) => pauseTrack(e)}/> :
                    <i className={`fas fa-play-circle episodeButton`} onClick={(e) => playTrack(e, episode)}/>}
                <i className="fas fa-plus-circle episodeButton" onClick={(e) => addTrack(e, episode)}/>
                <PlayedButton played={played} handlePlayedToggle={handlePlayedToggle}/>
            </div>
        </div>
    )
}