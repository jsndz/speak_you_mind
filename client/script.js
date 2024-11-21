import axios from "axios";
async function transcript() {
  const wavAudio = document.getElementById("wavAudio");
  const file = wavAudio.files[0];
  const formData = new FormData();
  formData.append("audio", file);
  const textFile = await axios.post(
    "http://localhost:3001/makeText",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
