import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import PresentationForm from "./components/PresentationForm";
import { Button } from 'primereact/button';

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
  });

  const handlePresentationClick = (title: string) => {
    navigate(`/presentation/${title}`);
  };
          

  return (
    <div className="App">
      <Header />
      <Button>sadf</Button>
      {/* <button onClick={fetchPresentations}>Fetch Presentations</button> */}
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
