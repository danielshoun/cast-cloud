import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {csrfFetch} from "../../store/csrf";

export default function ReviewList({podcastData}) {
    const userState = useSelector(state => state.session)
    const [reviewList, setReviewList] = useState([]);
    const [ownReview, setOwnReview] = useState(null);
    const [hoverStar, setHoverStar] = useState(null);
    const [selectedStar, setSelectedStar] = useState(null);
    const [ownReviewText, setOwnReviewText] = useState('');

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${podcastData.id}/reviews`);
            const data = await res.json();
            setReviewList(data);
            const ownReview = data.find(review => review.userId === userState.user.id);
            setOwnReview(ownReview);
        }
        fetchData().then();
    }, [podcastData, userState.user.id])

    async function handleSubmitReview() {
        const body = {
            rating: selectedStar,
            text: ownReviewText
        }
        const res = await csrfFetch(`/api/podcasts/${podcastData.id}/reviews`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = res.json();
        setReviewList(prevState => [data, ...prevState]);
        setOwnReview(data);
        setOwnReviewText(data.text);
    }

    return (
        <>
            {userState.user &&
                <div className='ownReviewContainer'>
                    {ownReview ?
                        <>
                            Edit Review
                        </> :
                        <>
                            <div className='ratingContainer'>
                                <span className='ratingText'>Choose a rating:</span>
                                <i
                                    className={`fas fa-star reviewStar${(hoverStar >= 1) ? ' highlightedStar' : (!hoverStar && selectedStar >= 1 ? ' highlightedStar' : '')}`}
                                    onMouseOver={() => setHoverStar(1)}
                                    onMouseLeave={() => setHoverStar(null)}
                                    onClick={() => setSelectedStar(1)}
                                />
                                <i
                                    className={`fas fa-star reviewStar${(hoverStar >= 2) ? ' highlightedStar' : (!hoverStar && selectedStar >= 2 ? ' highlightedStar' : '')}`}
                                    onMouseOver={() => setHoverStar(2)}
                                    onMouseLeave={() => setHoverStar(null)}
                                    onClick={() => setSelectedStar(2)}
                                />
                                <i
                                    className={`fas fa-star reviewStar${(hoverStar >= 3) ? ' highlightedStar' : (!hoverStar && selectedStar >= 3 ? ' highlightedStar' : '')}`}
                                    onMouseOver={() => setHoverStar(3)}
                                    onClick={() => setSelectedStar(3)}
                                />
                                <i
                                    className={`fas fa-star reviewStar${(hoverStar >= 4) ? ' highlightedStar' : (!hoverStar && selectedStar >= 4 ? ' highlightedStar' : '')}`}
                                    onMouseOver={() => setHoverStar(4)}
                                    onMouseLeave={() => setHoverStar(null)}
                                    onClick={() => setSelectedStar(4)}
                                />
                                <i
                                    className={`fas fa-star reviewStar${(hoverStar >= 5) ? ' highlightedStar' : (!hoverStar && selectedStar >= 5 ? ' highlightedStar' : '')}`}
                                    onMouseOver={() => setHoverStar(5)}
                                    onMouseLeave={() => setHoverStar(null)}
                                    onClick={() => setSelectedStar(5)}
                                />
                            </div>
                            <textarea className='reviewInput' placeholder='Write your review...' value={ownReviewText} onChange={event => setOwnReviewText(event.target.value)}/>
                            <button className='reviewSubmitButton' onClick={handleSubmitReview}>Submit</button>
                        </>
                    }
                </div>
            }
            {reviewList.map(review => {
                return (
                    <div key={review.id}>{review.text}</div>
                )
            })}
        </>
    )
}