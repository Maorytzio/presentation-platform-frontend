import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import PresentationForm from "./components/PresentationForm";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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
      </DataTable>
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
      // TODO:
      <div className="main-container">
        <PresentationForm />
      </div>
    </div>
  );
}

export default App;
