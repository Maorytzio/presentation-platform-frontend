import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { Dialog } from "primereact/dialog";

import axios from "axios";
import Header from "../components/Header";
import { InputTextarea } from "primereact/inputtextarea";

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

  const [isAddDialogVisible, setAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setEditDialogVisible] = useState(false);

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
            setAddDialogVisible(false);
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
        const response = await axios.patch(
          `http://localhost:3000/presentations/${presentation.title}/slides/${slideId}`,
          { content: editSlideContent }
        );
        setPresentation({
          ...presentation,
          slides: response.data.presentation.slides,
        });
        setEditSlideContent("");
        setSlideToEdit(null);
        setEditDialogVisible(false);
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

  const header = (
    <>
      <Button
        rounded
        onClick={handlePreviousSlide}
        disabled={currentSlideIndex === 0}
        severity="secondary"
      >
        Previous
      </Button>
      <Button
        rounded
        severity="secondary"
        onClick={handleNextSlide}
        disabled={currentSlideIndex === presentation.slides.length - 1}
        style={{ marginLeft: "0.5em" }}
      >
        Next
      </Button>
    </>
  );

  const footer = (
    <>
      <Button
        label="Add Slide"
        severity="success"
        rounded
        onClick={() => setAddDialogVisible(true)}
      />
      <Button
        label="Edit"
        severity="info"
        rounded
        style={{ marginLeft: "0.5em" }}
        onClick={() => {
          setSlideToEdit(currentSlideIndex);
          setEditDialogVisible(true);
        }}
      />
      <Button
        label="Delete"
        severity="danger"
        rounded
        style={{ marginLeft: "0.5em" }}
        onClick={() => handleDeleteSlide(currentSlideIndex)}
      />
    </>
  );

  const closeDialog = (type: string) => {
    if (type === "edit") {
      setEditDialogVisible(false);
    } else {
      setAddDialogVisible(false);
    }
  };

  const noSlides = (
    <>
      <Card style={{ marginTop: "10px" }}>
        <p>noSlides!</p>
        <Button
          label="Add Slide"
          severity="success"
          rounded
          onClick={() => setAddDialogVisible(true)}
        />
      </Card>
    </>
  );

  return (
    <div>
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>

      <Card title={presentation.title}>
        <p>Authors: {presentation?.authors?.join(", ") || "No authors"}</p>
        <p>
          Published on: {new Date(presentation.createdAt).toLocaleDateString()}
        </p>
      </Card>
      <div>
        {presentation.slides.length ? (
          <Card
            style={{ marginTop: "10px" }}
            title={`Slide ${currentSlideIndex + 1}`}
            footer={footer}
            header={header}
            className="md:w-25rem"
          >
            <p className="m-0">
              {presentation.slides[currentSlideIndex].content}
            </p>
          </Card>
        ) : (
          <div>{noSlides}</div>
        )}
      </div>
      <Dialog
        header="Add New Slide"
        visible={isAddDialogVisible}
        style={{ width: "50vw" }}
        footer={
          <>
            <Button
              label="Cancel"
              onClick={() => closeDialog("add")}
              className="p-button-text"
            />
            <Button label="Add" onClick={handleAddSlide} />
          </>
        }
        onHide={() => closeDialog("add")}
      >
        <div className="p-field">
          <label htmlFor="slides">Slide Content</label>
          <InputTextarea
            id="slides"
            rows={5}
            value={newSlideContent}
            onChange={(e) => setNewSlideContent(e.target.value)}
          />
        </div>
      </Dialog>
      <Dialog
        header="Edit Slide"
        visible={isEditDialogVisible}
        style={{ width: "50vw" }}
        footer={
          <>
            <Button
              label="Cancel"
              onClick={() => closeDialog("edit")}
              className="p-button-text"
            />
            <Button label="Edit" onClick={handleAlterSlide} />
          </>
        }
        onHide={() => closeDialog("edit")}
      >
        <div className="p-field">
          <label htmlFor="slides">Slide Content</label>
          <InputTextarea
            id="slides"
            rows={5}
            value={editSlideContent}
            onChange={(e) => setEditSlideContent(e.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default PresentationPreview;
