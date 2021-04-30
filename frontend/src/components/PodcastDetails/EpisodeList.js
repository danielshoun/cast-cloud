import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addToQueue, changeTrack, togglePlaying} from "../../store/audio";
import EpisodeItem from "./EpisodeItem";

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

    return (
        <>
            {episodeList.map((episode, i) => {
                return (
                    <EpisodeItem
                        key={i}
                        activeEpisode={activeEpisode}
                        handleActive={handleActive}
                        episode={episode}
                        podcastData={podcastData}
                    />
                )
            })}
        </>
    )
}