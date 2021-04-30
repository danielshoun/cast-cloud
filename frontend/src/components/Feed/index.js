import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import './Feed.css';
import React, {useEffect, useState} from "react";
import {addToQueue, changeTrack, togglePlaying} from "../../store/audio";

export default function Feed() {
    const sessionUser = useSelector(state => state.session.user);
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();
    const [selectedList, setSelectedList] = useState(-1);
    const [subscriptions, setSubscriptions] = useState([]);
    const [episodes, setEpisodes] = useState([]);

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
            const res = await fetch(`/api/podcasts/${subscriptions[selectedList].Podcast.id}/episodes`);
            const data = await res.json();
            setEpisodes(data);
        }

        async function fetchUnwatched() {

        }

        if(selectedList !== -1) {
            fetchOnePodcast().then()
        } else {
            fetchUnwatched().then();
        }
    }, [selectedList, subscriptions])

    if(!sessionUser) return (<Redirect to='/login'/>)

    function playTrack(e, episode) {
        e.stopPropagation();
        if(audioState.queue[audioState.currentTrack]?.url === episode.url) {
            dispatch(togglePlaying(true));
        } else {
            dispatch(changeTrack({
                podcastTitle: subscriptions[selectedList].Podcast.podcastTitle,
                artworkUrl: subscriptions[selectedList].Podcast.artworkUrl,
                itunesId: subscriptions[selectedList].Podcast.itunesId,
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
                podcastTitle: subscriptions[selectedList].Podcast.podcastTitle,
                artworkUrl: subscriptions[selectedList].Podcast.artworkUrl,
                itunesId: subscriptions[selectedList].Podcast.itunesId,
                ...episode
            }));
        }
    }

    return (
        <div className='feedContainer'>
            <div className='feedListContainer'>
                <div
                    className={`feedList feedListUnwatched${selectedList === -1 ? ' selectedUnwatched' : ''}`}
                    onClick={() => setSelectedList(-1)}
                >
                    All Unplayed
                </div>
                {subscriptions.map((subscription, i) => {
                    return (
                        <div
                            className={`listImgContainer${selectedList === i ? ` selectedList${i === subscriptions.length - 1 ? 'Last' : ''}` : ''}${i === subscriptions.length - 1 ? ' lastList' : ''}`}
                            key={subscription.id}
                            onClick={() => setSelectedList(i)}
                        >
                            <img className='feedListImage' src={subscription.Podcast.artworkUrl}/>
                        </div>
                    )
                })}
            </div>
            <div className='feedContent'>
                {episodes.map((episode, i) => {
                    return (
                        <div key={i} className='feedEpisodeContainer'>
                            <div className='feedEpisodeStatic'>
                                <img className='feedEpisodeImage' src={subscriptions[selectedList].Podcast.artworkUrl}/>
                                <div className='feedEpisodeInfo'>
                                    <div className='feedEpisodeTitle'>{episode.title}</div>
                                    <div className='feedEpisodeArtist'>{subscriptions[selectedList].Podcast.title}</div>
                                </div>
                            </div>
                            <div className='feedEpisodeActions'>
                                {audioState.queue[audioState.currentTrack]?.url === episode.url && audioState.playing ?
                                    <i className={`fas fa-pause-circle episodeButton`} onClick={(e) => pauseTrack(e)}/> :
                                    <i className={`fas fa-play-circle episodeButton`} onClick={(e) => playTrack(e, episode)}/>}
                                <i className="fas fa-plus-circle episodeButton" onClick={(e) => addTrack(e, episode)}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}