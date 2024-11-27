import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [audio, setAudio] = useState(null);
  const [text, setText] = useState(null);
  const handleAudioChange = (e) => {
    setAudio(e.target.files[0]);
  };

  const transcript = async (e) => {
    e.preventDefault();

    if (!audio) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audio);

    try {
      const response = await axios.post(
        "http://localhost:3000/makeText",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response) {
        setText(response.data.text);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Speak Your Mind</h1>
      <input type="file" id="wavAudio" onChange={handleAudioChange} />
      <button type="button" onClick={transcript}>
        Upload
      </button>

      {text ? <div>{text}</div> : <div></div>}
    </div>
  );
}

export default App;
