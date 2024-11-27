import path from "path";
import { nodewhisper } from "nodejs-whisper";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { STATE } from "./serverConfig.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let siteUrl =
  STATE === "development"
    ? "http://localhost:3001"
    : "https://speakyourmind.vercel.app";

const corsOptions = {
  origin: siteUrl,
  methods: ["GET", "POST"],
};
const app = express();
app.use(cors(corsOptions));
const upload = multer({
  dest: path.resolve(__dirname, "uploads/"), // Ensure uploads/ directory is absolute
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function createText(file) {
  try {
    const filePath = path.resolve(file.path);
    const result = await nodewhisper(filePath, {
      modelName: "tiny.en",
      autoDownloadModelName: "tiny.en",
      verbose: true,
      removeWavFileAfterTranscription: false,
      withCuda: false,
      whisperOptions: {
        outputInText: false,
        outputInVtt: false,
        outputInSrt: true,
        outputInCsv: false,
        translateToEnglish: false,
        language: "en",
        wordTimestamps: true,
        timestamps_length: 20,
        splitOnWord: true,
      },
    });
    console.log("Transcription Result:", result);

    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Error during transcription:", error);
  }
}
app.post("/makeText", upload.single("file"), async (req, res) => {
  try {
    const transcriptionFile = await createText(req.file);
    console.log("Transcription File:", transcriptionFile);
    return res
      .status(200)
      .json({ message: "success", text: transcriptionFile });
  } catch (error) {
    res.status(400).json({ message: "unsuccessfull", error: error });
  }
});
app.listen(3000, () => {
  console.log("server connected sucessfully");
});
