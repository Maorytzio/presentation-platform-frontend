import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import PresentationForm from "./components/PresentationForm";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

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
  // const [selectedPresentation, setSelectedPresentation] =
  //   useState<Presentation | null>(null);
  const [displayAddDialog, setDisplayAddDialog] = useState(false);
  const [newPresentation, setNewPresentation] = useState<Partial<Presentation>>(
    {
      title: "",
      authors: [],
      slides: [],
    }
  );

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
      setDisplayAddDialog(false);
    } catch (error) {
      console.error("Error creating presentation:", error);
    }
  };

  const handleDeletePresentation = async (title: string) => {
    try {
      await axios
        .delete(`http://localhost:3000/presentations/${title}`)
        .then(() => {
          setPresentations(presentations.filter((p) => p.title !== title));
        });
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  const handlePresentationClick = (title: string) => {
    navigate(`/presentation/${title}`);
  };

  const renderAddDialogFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => setDisplayAddDialog(false)}
          className="p-button-text"
        />
        <Button
          label="Add"
          icon="pi pi-check"
          onClick={handleCreatePresentation}
        />
      </div>
    );
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
          body={(rowData) => {
            const authors = rowData.authors;
            if (authors.length > 3) {
              return `${authors.slice(0, 3).join(", ")}...`;
            }
            return authors.join(", ");
          }}
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
      <div style={{ marginBottom: "1rem" }}>
        <Button
          label="Add Presentation"
          rounded
          onClick={() => setDisplayAddDialog(true)}
        />
      </div>

      <div className="main-container"></div>

      <Dialog
        header="Add New Presentation"
        visible={displayAddDialog}
        style={{ width: "50vw" }}
        footer={renderAddDialogFooter()}
        onHide={() => setDisplayAddDialog(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="title">Title</label>
            <InputText
              id="title"
              value={newPresentation.title}
              onChange={(e) =>
                setNewPresentation({
                  ...newPresentation,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="authors">Authors</label>
            <InputTextarea
              id="authors"
              value={newPresentation.authors?.join(", ")}
              onChange={(e) =>
                setNewPresentation({
                  ...newPresentation,
                  authors: e.target.value.split(","),
                })
              }
            />
          </div>
          {/* //TODO: You can add fields for slides as well */}
        </div>
      </Dialog>
    </div>
  );
}

export default App;
