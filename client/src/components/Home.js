import React from "react";
import { Link } from "react-router-dom";
import "../componentsStyle/Home.css";

/**
 * Home component
 * Displays a welcome message and a list of categories with descriptions and images.
 * Provides links to navigate to different category pages.
 */
export default function Home() {
  // Define an array of categories with their details
  const categories = [
    {
      name: "Freelancers",
      path: "categories/Freelancers",
      description:
        "Explore a diverse pool of freelancers offering services such as graphic design, content writing, web development, and more. Connect with talented individuals ready to help you with your projects.",
      video: 'http://localhost:5000/videos/Black and White Minimalist Animated Grunge Photography Camera YouTube Intro.mp4',
    },
    {
      name: "Students",
      path: "categories/Students",
      description:
        "Hire students for tutoring, research assistance, and other academic services. Support their education while benefiting from their knowledge and enthusiasm. A perfect match for one-off tasks and ongoing support.",
      video: 'http://localhost:5000/videos/Ask me your questions.mp4',
    },
    {
      name: "Professionals",
      path: "categories/Professionals",
      description:
        "Find seasoned professionals for business consulting, legal advice, medical services, and more. Our Professionals category connects you with experts in various fields who can provide you with top-notch services.",
      video: 'http://localhost:5000/videos/Secret Unfolding.mp4',
    },
    {
      name: "Home Services",
      path: "categories/HomeServices",
      description:
        "Discover a wide range of home services including repairs, cleaning, and maintenance. Whether you need a plumber, an electrician, or a general handyman, our Home Services category has got you covered.",
      video: 'http://localhost:5000/videos/home.mp4',
    },
    {
      name: "All categories",
      path: "categories/All",
      description:
        "Browse through all our categories to find the service or talent that perfectly fits your needs. From home repairs to professional consultations, explore the full range of services available on TalentTrade.",
      video: 'http://localhost:5000/uploads/Black and White Minimalist Animated Grunge Photography Camera YouTube Intro.mp4',
      }
  ];

  return (
    <div className="home-container">
      <main>
        <div className="home-header">
        <h1 id='item1'>Welcome to TalentTrade</h1>
          <p id='item2'>The platform for trading talents and services</p>
          <Link to="about" id='item3'>#ABOUT_US</Link>
        </div>
        <div className="home-content">
          <h2>Choose a Category to Continue:</h2>
          <ul className="flex-category">
            {/* Map through categories and render each category with a link */}
            {categories.map((category, index) => (
               <li key={index} className="category-item">
                <div className="category-video"> 
                <Link to={category.path} >
                  <video autoPlay loop muted width="200" height="auto" >
                    <source src={category.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Link> 
                </div>
                <Link to={category.path}>
                <div className="category-text">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
