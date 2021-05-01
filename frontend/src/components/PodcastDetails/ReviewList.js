import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {csrfFetch} from "../../store/csrf";

export default function ReviewList({podcastData}) {
    const userState = useSelector(state => state.session)
    const [reviewList, setReviewList] = useState([]);
    const [ownReview, setOwnReview] = useState(null);
    const [hoverStar, setHoverStar] = useState(null);
    const [selectedStar, setSelectedStar] = useState(null);
    const [ownReviewText, setOwnReviewText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${podcastData.id}/reviews`);
            const data = await res.json();
            setReviewList(data);
            if(userState.user) {
                const ownReview = data.find(review => review.userId === userState.user.id);

                if(ownReview) {
                    setOwnReview(ownReview);
                    setOwnReviewText(ownReview.text)
                    setSelectedStar(ownReview.rating);
                }
            }
        }
        fetchData().then();
    }, [podcastData, userState.user])

    async function handleSubmitReview() {
        if(!ownReviewText || !selectedStar) return;
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
        const data = await res.json();
        setReviewList(prevState => [data, ...prevState]);
        setOwnReview(data);
        setOwnReviewText(data.text);
        setSelectedStar(data.rating);
    }

    async function handleEditReview() {
        if(!ownReviewText || !selectedStar) return;
        const body = {
            rating: selectedStar,
            text: ownReviewText
        }
        const res = await csrfFetch(`/api/reviews/${ownReview.id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();

        setIsEditing(false);
        setOwnReview(data);
        setOwnReviewText(data.text);
        setSelectedStar(data.rating);

        const replacePoint = reviewList.findIndex(el => el.id === data.id);
        setReviewList(prevState => [...prevState.slice(0, replacePoint), data, ...prevState.slice(replacePoint + 1, prevState.length)]);
    }

    function handleCancelEdit() {
        setIsEditing(false);
        setOwnReviewText(ownReview.text);
        setSelectedStar(ownReview.rating);
    }

    async function handleDelete() {
        await csrfFetch(`/api/reviews/${ownReview.id}`, {
            method: 'DELETE'
        })

        setOwnReview(null);
        setOwnReviewText('');
        setSelectedStar(null);

        const deletePoint = reviewList.findIndex(el => el.id === ownReview.id);
        setReviewList(prevState => [...prevState.slice(0, deletePoint), ...prevState.slice(deletePoint + 1, prevState.length)]);
    }

    return (
        <>
            {userState.user &&
                <div className='ownReviewContainer'>
                    {ownReview && !isEditing ?
                        <>
                            <div className='reviewListDivider topDivider'>
                                <span>Your Review</span>
                                <span>
                                    <i
                                        className="fas fa-pencil-alt reviewButton"
                                        onClick={() => setIsEditing(true)}
                                    />
                                    <i
                                        className="fas fa-times reviewButton"
                                        onClick={() => handleDelete()}
                                    />
                                </span>
                            </div>
                            <div className='reviewContainer'>
                                <div className='reviewHeader'>
                            <span>
                                <span className='reviewUser'>{ownReview.User.username}</span>
                                <span className='reviewDate'>({new Date(ownReview.createdAt).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'})})</span>
                            </span>
                                    <span className='reviewRating'>
                                <i className={`fas fa-star reviewStar staticStar${ownReview.rating >= 1 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${ownReview.rating >= 2 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${ownReview.rating >= 3 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${ownReview.rating >= 4 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${ownReview.rating >= 5 ? ' highlightedStar' : ''}`}/>
                            </span>
                                </div>
                                <div className='reviewText'>{ownReview.text}</div>
                            </div>
                        </> :
                        <>
                            <div className='reviewListDivider topDivider'>{isEditing ?
                                <>
                                    <span>Your Review</span>
                                    <span>
                                        <i
                                            className="fas fa-pencil-alt reviewButton"
                                            onClick={() => setIsEditing(true)}
                                        />
                                        <i
                                            className="fas fa-times reviewButton"
                                            onClick={() => handleDelete()}
                                        />
                                    </span>
                                </> : 'Write A Review'}</div>
                            <div className='reviewContainer topDivider'>
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
                                <textarea maxLength={2000} className='reviewInput' placeholder='Write your review...' value={ownReviewText} onChange={event => setOwnReviewText(event.target.value)}/>
                                <button className='reviewSubmitButton' onClick={isEditing ? handleEditReview : handleSubmitReview}>Submit</button>
                                {isEditing && <button className='reviewEditButton' onClick={handleCancelEdit}>Cancel</button>}
                            </div>

                        </>
                    }
                </div>
            }
            <div className='reviewListDivider'>All Reviews</div>
            {reviewList.length > 0 ? reviewList.map(review => {
                return (
                    <div key={review.id} className='reviewContainer'>
                        <div className='reviewHeader'>
                            <span>
                                <span className='reviewUser'>{review.User.username}</span>
                                <span className='reviewDate'>({new Date(review.createdAt).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'})})</span>
                            </span>
                            <span className='reviewRating'>
                                <i className={`fas fa-star reviewStar staticStar${review.rating >= 1 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${review.rating >= 2 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${review.rating >= 3 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${review.rating >= 4 ? ' highlightedStar' : ''}`}/>
                                <i className={`fas fa-star reviewStar staticStar${review.rating >= 5 ? ' highlightedStar' : ''}`}/>
                            </span>
                        </div>
                        <div className='reviewText'>{review.text}</div>
                    </div>
                )}) :
                <div className='emptyReviewText'>There are no reviews for this podcast yet.</div>
            }
        </>
    )
}