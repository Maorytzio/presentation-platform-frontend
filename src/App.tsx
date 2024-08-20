import React, { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

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

  const handlePresentationClick = (title: string) => {
    navigate(`/presentation/${title}`);
  };
  return (
    <div className="App">
      <Header />
      <button onClick={fetchPresentations}>Fetch Presentations</button>
      <ul>
        {presentations.map((presentation) => (
          <li  key={presentation.title} onClick={() => handlePresentationClick(presentation.title)}>
            {presentation.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
