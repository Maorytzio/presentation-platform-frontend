import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";

import axios from "axios";

interface Slide {
  _id: string; // Unique ID for each slide
  content: string;
  slideNum: number;
}

interface Presentation {
  _id: string;
  title: string;
  authors: string[];
  slides: Slide[];
  createdAt: string;
}

function PresentationPreview() {
  const { title } = useParams<{ title: string }>();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [newSlideContent, setNewSlideContent] = useState("");
  const [editSlideContent, setEditSlideContent] = useState("");
  const [slideToEdit, setSlideToEdit] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get<Presentation>(
          `http://localhost:3000/presentations/${title}`
        );
        const orderedSlides = response.data.slides.map((slide, index) => {
          return { ...slide, slideNum: index + 1 };
        });
        setPresentation({ ...response.data, slides: orderedSlides });
      } catch (error) {
        console.error("Error fetching presentation:", error);
      }
    };

    (async () => await fetchPresentation())();
  }, [title]);

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

  const handleAddSlide = async (e: FormEvent) => {
    e.preventDefault();
    if (presentation) {
      try {
        await axios
          .post(
            `http://localhost:3000/presentations/${presentation.title}/slides`,
            { content: newSlideContent }
          )
          .then((response) => {
            console.log(response.data);
            setPresentation({
              ...presentation,
              slides: response.data.presentation.slides,
            });
            setNewSlideContent("");
            setCurrentSlideIndex(response.data.presentation.slides.length - 1);
          });
      } catch (error) {
        console.error("Error adding slide:", error);
      }
    }
  };

  const handleAlterSlide = async (e: FormEvent) => {
    e.preventDefault();
    if (presentation && slideToEdit !== null) {
      try {
        const slideId = presentation.slides[slideToEdit]._id;
        const response = await axios.patch<Presentation>(
          `http://localhost:3000/presentations/${presentation.title}/slides/${slideId}`,
          { content: editSlideContent }
        );
        setPresentation(response.data);
        setEditSlideContent("");
        setSlideToEdit(null);
      } catch (error) {
        console.error("Error altering slide:", error);
      }
    }
  };

  const handleDeleteSlide = async (slideIndex: number) => {
    if (presentation) {
      try {
        const slideId = presentation.slides[slideIndex]._id;
        await axios
          .delete(
            `http://localhost:3000/presentations/${presentation.title}/slides/${slideId}`
          )
          .then((response) => {
            setPresentation({
              ...presentation,
              slides: response.data.presentation.slides,
            });
            if (currentSlideIndex > 0) {
              setCurrentSlideIndex(slideIndex - 1);
            } else if (currentSlideIndex === 0) {
              setCurrentSlideIndex(slideIndex + 1);
            }
          });
      } catch (error) {
        console.error("Error deleting slide:", error);
      }
    }
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  if (!presentation) return <div>Loading...</div>;

  return (
    <div>
      <Card title={presentation.title}>
        <p>Authors: {presentation?.authors?.join(", ") || "No authors"}</p>
        <p>
          Published on: {new Date(presentation.createdAt).toLocaleDateString()}
        </p>
      </Card>

      <div>
        {presentation.slides.length ? (
          <div>
            <h2>Slide {currentSlideIndex + 1}</h2>
            <p>{presentation.slides[currentSlideIndex].content}</p>
          </div>
        ) : (
          <p>NO Slides</p>
        )}
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
      <form onSubmit={handleAddSlide}>
        <h3>Add New Slide</h3>
        <textarea
          value={newSlideContent}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setNewSlideContent(e.target.value)
          }
          placeholder="Slide content"
        />
        <button type="submit">Add Slide</button>
      </form>
      {presentation.slides.length > 0 && (
        <div>
          <h3>Edit Slide</h3>
          <Dropdown
            value={presentation.slides[currentSlideIndex]}
            onChange={(e) =>
              setCurrentSlideIndex(
                presentation.slides.findIndex(
                  (slide) => slide._id === e.target.value._id
                )
              )
            }
            options={presentation.slides}
            optionLabel="slideNum"
            placeholder="Select a City"
            className="w-full md:w-14rem"
          />

          <select onChange={(e) => setSlideToEdit(Number(e.target.value))}>
            <option value="">Select Slide to Edit</option>
            {presentation.slides.map((slide, index) => (
              <option key={slide._id} value={index}>
                Slide {index + 1}
              </option>
            ))}
          </select>
          {slideToEdit !== null && (
            <form onSubmit={handleAlterSlide}>
              <textarea
                value={editSlideContent}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setEditSlideContent(e.target.value)
                }
                placeholder="New slide content"
              />
              <button type="submit">Update Slide</button>
              <button
                type="button"
                onClick={() => handleDeleteSlide(slideToEdit)}
              >
                Delete Slide
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default PresentationPreview;
