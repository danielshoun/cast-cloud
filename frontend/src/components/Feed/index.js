import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import './Feed.css';
import {useEffect, useState} from "react";

export default function Feed() {
    const sessionUser = useSelector(state => state.session.user);
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

    return (
        <div className='feedContainer'>
            <div className='feedListContainer'>
                <div
                    className={`feedList feedListUnwatched${selectedList === -1 ? ' selectedUnwatched' : ''}`}
                    onClick={() => setSelectedList(-1)}
                >
                    All Unlistened
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
                        <div>
                            {episode.title}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}