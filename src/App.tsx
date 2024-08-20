// import Header from "./components/Header";
// function App() {
//   return (
//     <div className="App">
//       <Header />

//     </div>
//   );
// }
// export default App;

import React, { useState } from "react";
import axios from "axios";
import Header from "./components/Header";

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

  return (
    <div className="App">
      <Header />
      <button onClick={fetchPresentations}>Fetch Presentations</button>
      <ul>
        {presentations.map((presentation) => (
          <li key={presentation._id}>{presentation.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
