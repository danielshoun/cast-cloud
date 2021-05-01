import React, {useEffect, useState} from "react";
import EpisodeItem from "./EpisodeItem";

export default function EpisodeList({ podcastData }) {
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

    function modifyEpisodeProgress(newEpisodeProgress) {
        const replacePoint = episodeList.findIndex(episode => episode.id === newEpisodeProgress.episodeId);
        const episode = Object.assign({}, episodeList[replacePoint]);
        episode.EpisodeProgresses = [newEpisodeProgress];
        setEpisodeList(prevState => [...prevState.slice(0, replacePoint), episode, ...prevState.slice(replacePoint + 1, prevState.length)]);

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
                        modifyEpisodeProgress={modifyEpisodeProgress}
                    />
                )
            })}
        </>
    )
}