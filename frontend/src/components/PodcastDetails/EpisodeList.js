import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addToQueue, changeTrack, togglePlaying} from "../../store/audio";

export default function EpisodeList({ itunesId, podcastTitle, artworkUrl }) {
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();
    const [episodeList, setEpisodeList] = useState([]);
    const [activeEpisode, setActiveEpisode] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${itunesId}/episodes`);
            const data = await res.json();
            setEpisodeList(data);
        }
        fetchData().then();
    }, [itunesId])

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

    function playTrack(episode) {
        if(audioState.currentTrack?.url === episode.enclosure.url) {
            dispatch(togglePlaying(true));
        } else {
            dispatch(changeTrack({podcastTitle, artworkUrl, itunesId, title: episode.title, url: episode.enclosure.url, type: episode.enclosure.type}))
        }
    }

    function pauseTrack() {
        dispatch(togglePlaying(false));
    }

    function addTrack(episode) {
        dispatch(addToQueue({podcastTitle, artworkUrl, itunesId, title: episode.title, url: episode.enclosure.url, type: episode.enclosure.type}));
    }

    return (
        <>
            {episodeList.items.map(episode => {
                return (
                    <div key={episode.guid} className='episodeContainer'>
                        <div className={`episodeHeader${activeEpisode === episode.guid ? ' activeEpisode' : ''}`}>
                            <span className='episodeTitle' onClick={() => handleActive(episode)}>
                                {activeEpisode === episode.guid ? <i className="fas fa-angle-down titleCaret"/> :
                                <i className="fas fa-angle-right titleCaret"/> }
                                {episode.title}
                            </span>
                            <div className='episodeControls'>
                                {audioState.currentTrack?.url === episode.enclosure.url && audioState.playing ?
                                    <i className={`fas fa-pause-circle episodeButton`} onClick={() => pauseTrack()}/> :
                                    <i className={`fas fa-play-circle episodeButton`} onClick={() => playTrack(episode)}/>}
                                <i className="fas fa-plus-circle episodeButton" onClick={() => addTrack(episode)}/>
                            </div>

                        </div>
                        {activeEpisode === episode.guid && (
                            <div>
                                <div className='episodeDescription'>{episode.itunes.summary || episode.contentSnippet}</div>
                            </div>
                        )}
                    </div>
                )
            })}
        </>
    )
}