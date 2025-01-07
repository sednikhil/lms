import React, { useState, useEffect } from "react";
import "../Assets/css/landing.css";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="land-top">
      <div className="land-inner-top">
        <div className={`land-banner-image ${isLoading ? "loading" : ""}`}>
          {isLoading && (
            <div className="loaders book">
              <figure className="page"></figure>
              <figure className="page"></figure>
              <figure className="page"></figure>
            </div>
          )}
          <img
            style={{ display: isLoading ? "none" : "block" ,
            width: "60%",
            paddingLeft: "8rem",
            borderRadius: "1rem",
            }}
            src="https://images.unsplash.com/photo-1655993810480-c15dccf9b3a0?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="reading-girl"
            srcSet=""
           
          />
        </div>
        <div className="land-banner-slogan">
          <div className="land-banner-slogan-inner">
            <div className="land-logo">String Ventures</div>
            <div className="land-motto">library</div>
            <div className="land-button">
              <a className="landing-button-hover" href="/home">
                <span>GO!!</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
