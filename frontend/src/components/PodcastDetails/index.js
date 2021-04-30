import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import './PodcastDetails.css';
import ReviewList from "./ReviewList";
import EpisodeList from "./EpisodeList";
import { csrfFetch } from '../../store/csrf';
import {useSelector} from "react-redux";

export default function PodcastDetails() {
    const userState = useSelector(state => state.session)
    const { itunesId } = useParams();
    const [podcastData, setPodcastData] = useState(null);
    const [tabOption, setTabOption] = useState('episodes');
    const [isSubscribed, setIsSubscribed] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const podRes = await fetch(`/api/podcasts/${itunesId}`);
            const podData = await podRes.json();
            setPodcastData(podData);
            if(userState.user) {
                const subRes = await fetch(`/api/subscriptions/${podData.id}`);
                const subData = await subRes.json();
                if(subData) setIsSubscribed(true);
                else setIsSubscribed(false);
            }
        }
        fetchData().then();
    }, [itunesId]);

    async function handleSubscribe() {
        if(isSubscribed) {
            const res = await csrfFetch(`/api/subscriptions/${podcastData.id}`, {
                method: 'DELETE'
            });
            setIsSubscribed(false);
        } else {
            const res = await csrfFetch(`/api/podcasts/${podcastData.id}/subscribe`, {
                method: 'POST'
            })
            setIsSubscribed(true);
        }
    }

    if(!podcastData) {
        return (
            <>
            </>
        )
    }
    else {
        return (
            <div className='podcastDetailsContainer'>
                <div className='podcastDetailsHeader'>
                    <img className='podcastArtwork' src={podcastData.artworkUrl} alt='Podcast Artwork'/>
                    <div className='podcastInfo'>
                        <div className='podcastInfoHeader'>
                            <span className='podcastTitle'>{podcastData.title}</span>
                            <span className='podcastArtist'>{podcastData.artist}</span>
                            {userState.user && <button className={`buttonPrimary subscribeButton${isSubscribed ? ' buttonDelete' : ''}`} onClick={handleSubscribe}>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</button>}
                        </div>
                        <div className='podcastInfoFooter'>
                            <span className='podcastDescription'>{podcastData.description}</span>
                        </div>
                    </div>
                </div>
                <div className='podcastTabMenu'>
                    <span className='podcastTab' onClick={() => setTabOption('episodes')}>Episodes</span>
                    <span className='podcastTab' onClick={() => setTabOption('reviews')}>Reviews</span>
                </div>
                <div className='podcastList'>
                    {tabOption === 'reviews' ? <ReviewList podcastData={podcastData}/> :
                        <EpisodeList
                            podcastTitle={podcastData.title}
                            artworkUrl={podcastData.artworkUrl}
                            podcastData={podcastData}
                        />}
                </div>
            </div>
        )
    }
}