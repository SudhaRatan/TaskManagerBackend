import { SpeechClient } from "@google-cloud/speech";
const sc = new SpeechClient();

export async function transcribe(audioBase64, platform) {
  const audio = {
    content: audioBase64,
  };

  process.env.GOOGLE_APPLICATION_CREDENTIALS='speech2text-426916-9d970b181b27.json'

  const config = platform == "web" ? {
    encoding:"WEBM_OPUS",
    languageCode: "en-US",
  }: {
    encoding:"MP3",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };
  
  return new Promise((resolve, reject) => {
    sc.recognize({ audio: { content: audioBase64 }, config: config })
      .then((data) => {
        resolve(data[0].results[0].alternatives[0].transcript);
      })
      .catch((error) => {
        // console.warn(audioBase64)
        reject(error);
      });
  });
}
