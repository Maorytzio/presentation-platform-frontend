import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
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
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [newPresentation, setNewPresentation] = useState({
    title: "",
    authors: "",
    slides: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const response = await axios.get<Presentation[]>(
          "http://localhost:3000/presentations"
        );
        setPresentations(response.data);
      } catch (error) {
        console.error("Error fetching presentations:", error);
      }
    };

    fetchPresentations();
  }, []);

  const handleCreatePresentation = async () => {
    const slidesArray = newPresentation.slides
      .split("\n")
      .filter((slide) => slide.trim() !== "")
      .map((slide) => ({ content: slide.trim() }));

    const authorsArray = newPresentation.authors
      .split(",")
      .map((author) => author.trim());

    const newPresentationData = {
      title: newPresentation.title,
      authors: authorsArray,
      slides: slidesArray,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/presentations",
        newPresentationData
      );
      setPresentations([...presentations, response.data.presentation]);
      setDialogVisible(false);
      setNewPresentation({ title: "", authors: "", slides: "" });
    } catch (error) {
      console.error("Error creating presentation:", error);
    }
  };

  const handleDeletePresentation = async (title: string) => {
    try {
      await axios.delete(`http://localhost:3000/presentations/${title}`);
      setPresentations(presentations.filter((p) => p.title !== title));
    } catch (error) {
      console.error("Error deleting presentation:", error);
    }
  };

  const handlePresentationClick = (title: string) => {
    navigate(`/presentation/${title}`);
  };

  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setNewPresentation({ title: "", authors: "", slides: "" });
  };

  return (
    <div className="App">
      <Header />

      <DataTable
        value={presentations}
        paginator
        rows={10}
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
            const authorsDisplay =
              rowData.authors.length > 3
                ? `${rowData.authors.slice(0, 3).join(", ")}...`
                : rowData.authors.join(", ");
            return <span>{authorsDisplay}</span>;
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
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={() => {
                handleDeletePresentation(rowData.title);
              }}
            />
          )}
        ></Column>
      </DataTable>

      <div style={{ marginBottom: "1rem" }}>
        <Button label="Add Presentation" rounded onClick={openDialog} />
      </div>

      <Dialog
        header="Add New Presentation"
        visible={isDialogVisible}
        style={{ width: "50vw" }}
        footer={
          <>
            <Button
              label="Cancel"
              onClick={closeDialog}
              className="p-button-text"
            />
            <Button label="Add" onClick={handleCreatePresentation} />
          </>
        }
        onHide={closeDialog}
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
            <label htmlFor="authors">Authors (comma-separated)</label>
            <InputText
              id="authors"
              value={newPresentation.authors}
              onChange={(e) =>
                setNewPresentation({
                  ...newPresentation,
                  authors: e.target.value,
                })
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="slides">Slides (one per line)</label>
            <InputTextarea
              id="slides"
              rows={5}
              value={newPresentation.slides}
              onChange={(e) =>
                setNewPresentation({
                  ...newPresentation,
                  slides: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Dialog>

      <div className="main-container"></div>
    </div>
  );
}

export default App;
