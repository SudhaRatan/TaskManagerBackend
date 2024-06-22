import express, { response } from "express";
import cors from "cors";
import { search, searchWithAudio } from "./ai_api.js";
import { transcribe } from "./speech_api.js";
const app = express();
const router = express.Router();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

router.route("/").get((req, res) => {
  res.send("Hllo");
});

router.route("/search").post(async (req, res) => {
  console.log("getting", req.body.audio);
  try {
    var result = await searchWithAudio({
      audio: req.body.audio,
    });
    result = result.replace("json", "");
    result = result.replace("```", "");
    result = result.replace("```", "");
    res.json(JSON.parse(result));
  } catch (error) {
    console.log(error, result);
    res.json({ error: error });
  }
});

router.route("/transcribe").post(async (req, res) => {
  const audio = req.body.audio;
  const platform = req.body.platform;
  try {
    const result = await transcribe(audio, platform);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.route("/prompt/:prompt").get(async (req, res) => {
  console.log("getting");
  try {
    var result = await search(req.params.prompt);
    result = result.replace("json", "");
    result = result.replace("```", "");
    result = result.replace("```", "");
    res.json(JSON.parse(result));
  } catch (error) {
    console.log(error, result);
    res.status(400).json({ error: true });
  }
});

app.use("/", router);

app.listen(process.env.PORT, function () {
  console.log("Server running on port " + this.address().port);
});
