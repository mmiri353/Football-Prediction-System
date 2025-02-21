import React from "react";
import { useNavigate } from "react-router-dom";
import europ from '../../assets/europ.avif';
import './News.css';

const News = () => {
  const navigate = useNavigate();

  const goToPage = () => {
    navigate('/europeleagueinfo');
  };

  return (
    <section className="news">
      <div className="news-container">
        <div className="news-content" onClick={goToPage}>
          <img 
            src={europ} 
            alt="Europa League" 
            className="news-image"
          />
          <h1 className="news-title">2024/25 Europa League Details</h1>
        </div>
      </div>
    </section>
  );
};

export default News;