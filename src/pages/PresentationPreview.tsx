import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Slide {
  content: string;
}

interface Presentation {
  _id: string;
  title: string;
  authors: string[];
  slides: Slide[];
  createdAt: string;
}

function PresentationPreview() {
  const { id } = useParams<{ id: string }>();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const [fetchErr, setFetchErr] = useState(null);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get<Presentation>(
          `http://localhost:3000/presentations/${id}`
        );
        setPresentation(response.data);
        setFetchErr(null)
      } catch (error) {
        console.error("Error fetching presentation:", error);
      }
    };

    fetchPresentation();
  }, [id]);

  const handleNextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleAddSlide = async (newSlideContent: string) => {
    // Implement logic to add a new slide
  };

  const handleAlterSlide = async (
    slideIndex: number,
    newSlideContent: string
  ) => {
    // Implement logic to alter an existing slide
  };

  const handleDeleteSlide = async (slideIndex: number) => {
    // Implement logic to delete an existing slide
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  if (!presentation) return <div>Loading...</div>;

  return (
    <div>
      <h1>{presentation.title}</h1>
      <p>Authors: {presentation.authors.join(", ")}</p>
      <p>
        Published on: {new Date(presentation.createdAt).toLocaleDateString()}
      </p>
      <div>
        <h2>Slide {currentSlideIndex + 1}</h2>
        <p>{presentation.slides[currentSlideIndex].content}</p>
        <button
          onClick={handlePreviousSlide}
          disabled={currentSlideIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={handleNextSlide}
          disabled={currentSlideIndex === presentation.slides.length - 1}
        >
          Next
        </button>
      </div>
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  );
}

export default PresentationPreview;
