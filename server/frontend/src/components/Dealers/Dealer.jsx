import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";

import Header from '../Header/Header';
import positiveIcon from "../assets/positive.png";
import neutralIcon from "../assets/neutral.png";
import negativeIcon from "../assets/negative.png";
import reviewIcon from "../assets/reviewbutton.png";

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const currentUrl = window.location.href;
  const baseUrl = currentUrl.substring(0, currentUrl.indexOf("dealer"));
  const dealerUrl = `${baseUrl}djangoapp/dealer/${id}`;
  const reviewsUrl = `${baseUrl}djangoapp/reviews/dealer/${id}`;
  const postReviewUrl = `${baseUrl}postreview/${id}`;

  const fetchDealer = async () => {
    try {
      const response = await fetch(dealerUrl);
      const data = await response.json();
        if (data.status === 200 && data.dealer) {
  setDealer(data.dealer);
      } else {
        setDealer(null);
      }
    } catch (error) {
      setHasError(true);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(reviewsUrl);
      const data = await response.json();
      if (data.status === 200) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      setHasError(true);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return positiveIcon;
      case 'negative':
        return negativeIcon;
      default:
        return neutralIcon;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDealer();
      await fetchReviews();
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  return (
    <div className="dealer-page">
      <Header />
      <main style={{ margin: "20px" }}>
        {hasError ? (
          <p className="error-message">❌ Failed to load dealer data. Please try again later.</p>
        ) : isLoading ? (
          <p className="loading-message">⏳ Loading dealer info...</p>
        ) : dealer ? (
          <>
            <section className="dealer-info">
              <h1 style={{ color: "grey" }}>
                {dealer.full_name}
                {sessionStorage.getItem("username") && (
                  <a href={postReviewUrl}>
                    <img
                      src={reviewIcon}
                      alt="Post Review"
                      className="post-review-icon"
                      style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
                    />
                  </a>
                )}
              </h1>
              <h4 style={{ color: "grey" }}>
                {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
              </h4>
            </section>

            <section className="reviews_panel">
              {reviews.length === 0 ? (
                <p className="no-reviews-message">No reviews yet!</p>
              ) : (
                reviews.map((review, index) => (
                  <article key={index} className="review_panel">
                    <img
                      src={getSentimentIcon(review.sentiment)}
                      className="emotion_icon"
                      alt="Sentiment"
                    />
                    <div className="review-text" style={{marginTop: "50px"}}>{review.review}</div>
                    <footer className="reviewer">
                      {review.name} - {review.car_make} {review.car_model} ({review.car_year})
                    </footer>
                  </article>
                ))
              )}
            </section>
          </>
        ) : (
          <p className="no-dealer-message">Dealer not found.</p>
        )}
      </main>
    </div>
  );
};

export default Dealer;
