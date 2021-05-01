import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import './Feed.css';
import React, {useEffect, useState} from "react";
import FeedEpisode from "./FeedEpisode";

export default function Feed() {
    const sessionUser = useSelector(state => state.session.user);
    const [selectedList, setSelectedList] = useState(-1);
    const [subscriptions, setSubscriptions] = useState([]);
    const [playedEpisodes, setPlayedEpisodes] = useState([]);
    const [unplayedEpisodes, setUnplayedEpisodes] = useState([]);
    const [episodesLoaded, setEpisodesLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/subscriptions');
            const data = await res.json();
            setSubscriptions(data);
        }
        fetchData().then();
    }, [sessionUser])

    useEffect(() => {
        async function fetchOnePodcast() {
            const res = await fetch(`/api/podcasts/${subscriptions[selectedList].Podcast.id}/episodes?subscription=1`);
            const data = await res.json();
            const played = [];
            const unplayed = [];
            data.forEach(episode => {
                if(episode.EpisodeProgresses[0]?.played) {
                    played.push(episode);
                } else {
                    unplayed.push(episode);
                }
            })
            setPlayedEpisodes(played);
            setUnplayedEpisodes(unplayed);

        }

        async function fetchUnwatched() {
            const res = await fetch(`/api/episodes/`);
            const data = await res.json();
            setUnplayedEpisodes(data);
        }

        if(selectedList !== -1) {
            setEpisodesLoaded(false);
            fetchOnePodcast().then(() => setEpisodesLoaded(true))
        } else {
            setEpisodesLoaded(false);
            fetchUnwatched().then(() => setEpisodesLoaded(true));
        }
    }, [selectedList, subscriptions])

    if(!sessionUser) return (<Redirect to='/login'/>)

    function handleSelected(i) {
        if(i !== selectedList) {
            setPlayedEpisodes([]);
            setUnplayedEpisodes([]);
            setSelectedList(i);
        }
    }

    function modifyEpisodeProgress(newEpisodeProgress, deletePoint) {
        if(newEpisodeProgress.played) {
            const episode = Object.assign({}, unplayedEpisodes[deletePoint]);
            episode.EpisodeProgresses = [newEpisodeProgress];
            setUnplayedEpisodes(prevState => [...prevState.slice(0, deletePoint), ...prevState.slice(deletePoint + 1, prevState.length)]);
            let insertPoint = playedEpisodes.findIndex(el => el.releaseDate < episode.releaseDate);
            if(insertPoint === -1) insertPoint = playedEpisodes.length - 1;
            setPlayedEpisodes(prevState => [...prevState.slice(0, insertPoint), episode, ...prevState.slice(insertPoint, prevState.length)]);
        } else {
            const episode = Object.assign({}, playedEpisodes[deletePoint]);
            episode.EpisodeProgresses = [newEpisodeProgress];
            setPlayedEpisodes(prevState => [...prevState.slice(0, deletePoint), ...prevState.slice(deletePoint + 1, prevState.length)]);
            let insertPoint = unplayedEpisodes.findIndex(el => el.releaseDate < episode.releaseDate);
            if(insertPoint === -1) insertPoint = unplayedEpisodes.length - 1;
            setUnplayedEpisodes(prevState => [...prevState.slice(0, insertPoint), episode, ...prevState.slice(insertPoint, prevState.length)]);
        }
    }

    console.log(unplayedEpisodes);

    return (
        <div className='feedContainer'>
            <div className='feedListContainer'>
                <div
                    className={`feedList feedListUnwatched${selectedList === -1 ? ' selectedUnwatched' : ''}`}
                    onClick={() => handleSelected(-1)}
                >
                    All Unplayed
                </div>
                {subscriptions.map((subscription, i) => {
                    return (
                        <div
                            className={`listImgContainer${selectedList === i ? ` selectedList${i === subscriptions.length - 1 ? 'Last' : ''}` : ''}${i === subscriptions.length - 1 ? ' lastList' : ''}`}
                            key={subscription.id}
                            onClick={() => handleSelected(i)}
                        >
                            <img className='feedListImage' src={subscription.Podcast.artworkUrl}/>
                        </div>
                    )
                })}
            </div>
            <div className='feedContent'>
                {selectedList === -1 ?
                    <>
                        <div className='feedContentHeader'>Unplayed Episodes</div>
                        {unplayedEpisodes.length > 0 ? unplayedEpisodes.map((episode, i) => {
                            return (
                                <FeedEpisode key={i} deletePoint={i} podcast={episode.Podcast} episode={episode} modifyEpisodeProgress={modifyEpisodeProgress}/>
                            )
                        }) : <div className='emptyFeedContent'>{episodesLoaded ? "You don't have anything new to listen to!" : 'Loading podcast episodes...'}</div>}
                    </>:
                    <>
                        <div className='feedContentHeader'>Unplayed Episodes</div>
                        {unplayedEpisodes.length > 0 ? unplayedEpisodes.map((episode, i) => {
                            return (
                                <FeedEpisode key={i} deletePoint={i} podcast={subscriptions[selectedList].Podcast} episode={episode} modifyEpisodeProgress={modifyEpisodeProgress}/>
                            )
                        }) : <div className='emptyFeedContent'>{episodesLoaded ? "You don't have any unplayed episodes for this podcast." : 'Loading podcast episodes...'}</div>}
                        <div className='feedContentHeader playedHeader'>Played Episodes</div>
                        {playedEpisodes.length > 0 ? playedEpisodes.map((episode, i) => {
                            return (
                                <FeedEpisode key={i} deletePoint={i} podcast={subscriptions[selectedList].Podcast} episode={episode} modifyEpisodeProgress={modifyEpisodeProgress}/>
                            )
                        }) : <div className='emptyFeedContent'>{episodesLoaded ? "You don't have any played episodes for this podcast." : 'Loading podcast episodes...'}</div>}
                    </>
                }

            </div>
        </div>
    )
}