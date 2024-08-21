import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import PresentationForm from "./components/PresentationForm";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

// Define interfaces for the data structure
interface Slide {
  content: string;
}

interface Presentation {
  _id: string;
  title: string;
  authors: string[];
  slides: Slide[];
}

function App() {
  const [presentations, setPresentations] = useState<Presentation[] | []>([]);
  const [selectedPresentation, setSelectedPresentation] =
    useState<Presentation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const response = await axios.get<Presentation[]>(
          "http://localhost:3000/presentations"
        );
        console.log(response.data);
        setPresentations(response.data);
      } catch (error) {
        console.error("Error fetching presentations:", error);
      }
    };

    (async () => await fetchPresentations())();
  }, []);

  const handleCreatePresentation = async () => {
    try {
      const newPresentation = {
        title: "New Presentation", // Replace with the desired title or form input
        authors: [], // Add any default authors if needed
        slides: [], // Initialize with empty slides
      };

      const response = await axios.post(
        "http://localhost:3000/presentations",
        newPresentation
      );
      setPresentations([...presentations, response.data]);
    } catch (error) {
      console.error("Error creating presentation:", error);
    }
  };

  // const handleDeletePresentation = async () => {
  //   if (!selectedPresentation) {
  //     alert("Please select a presentation to delete.");
  //     return;
  //   }
  //   try {
  //     await axios.delete(
  //       `http://localhost:3000/presentations/${selectedPresentation.title}`
  //     );
  //     setPresentations(
  //       presentations.filter((p) => p.title !== selectedPresentation.title)
  //     );
  //     setSelectedPresentation(null);
  //   } catch (error) {
  //     console.error("Error deleting presentation:", error);
  //   }
  // };
  const handleDeletePresentation = async (title: string) => {
    try {
      await axios
        .delete(`http://localhost:3000/presentations/${title}`)
        .then(() => {
          setPresentations(
            presentations.filter((p) => p.title !== title)
          );
        });
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  const handlePresentationClick = (title: string) => {
    navigate(`/presentation/${title}`);
  };

  return (
    <div className="App">
      <Header />
      <DataTable
        value={presentations}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        onRowClick={(e) => handlePresentationClick(e.data.title)}
        selectionMode="single"
      >
        <Column field="title" header="Title" style={{ width: "25%" }}></Column>
        <Column
          field="authors"
          header="Authors"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="slides.length"
          header="Num of Slides"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="createdAt"
          header="Publication Date"
          style={{ width: "25%" }}
          body={(rowData) =>
            new Date(rowData.createdAt).toLocaleDateString("he-IL", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          }
        ></Column>
        <Column
          header=""
          style={{ width: "25%" }}
          body={(rowData) => (
            <Button
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
              aria-label="Cancel"
              onClick={() => handleDeletePresentation(rowData.title)}
            />
          )}
        ></Column>
      </DataTable>
      <div style={{ marginBottom: "0rem" }}>
        {/* // TODO: */}
        <Button
          label="Add Presentation"
          rounded
          onClick={handleCreatePresentation}
        />
      </div>
      <ul>
        {presentations.map((presentation) => (
          <li
            key={presentation.title}
            onClick={() => handlePresentationClick(presentation.title)}
          >
            {presentation.title}
          </li>
        ))}
      </ul>

      <div className="main-container">
        <PresentationForm />
      </div>
    </div>
  );
}

export default App;
