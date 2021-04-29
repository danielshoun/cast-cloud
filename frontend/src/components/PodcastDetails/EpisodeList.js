import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addToQueue, changeTrack, togglePlaying} from "../../store/audio";

export default function EpisodeList({ podcastData, podcastTitle, artworkUrl }) {
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();
    const [episodeList, setEpisodeList] = useState([]);
    const [activeEpisode, setActiveEpisode] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${podcastData.id}/episodes`);
            const data = await res.json();
            setEpisodeList(data);
        }
        fetchData().then();
    }, [podcastData])

    if(episodeList.length === 0) {
        return (<></>)
    }

    function handleActive(episode) {
        if(activeEpisode === episode.guid) {
            setActiveEpisode(null);
        } else {
            setActiveEpisode(episode.guid)
        }
    }

    function playTrack(e, episode) {
        e.stopPropagation();
        if(audioState.queue[audioState.currentTrack]?.url === episode.url) {
            dispatch(togglePlaying(true));
        } else {
            dispatch(changeTrack({
                podcastTitle,
                artworkUrl,
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
                podcastTitle,
                artworkUrl,
                itunesId: podcastData.itunesId,
                ...episode
            }));
        }
    }

    return (
        <>
            {episodeList.map((episode, i) => {
                return (
                    <div key={i} className='episodeContainer'>
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
            })}
        </>
    )
}