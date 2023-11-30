"use client";

import { useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// styles
import styles from "./Components.module.scss";

const SPEECH_KEY = process.env.NEXT_PUBLIC_SPEECH_KEY;
const SPEECH_REGION = process.env.NEXT_PUBLIC_SPEECH_REGION;

const TextToSpeechComponent = () => {
  const [textToSpeak, setTextToSpeak] = useState("");
  const subscriptionKey = SPEECH_KEY;
  const serviceRegion = SPEECH_REGION;

  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  const handleInputChange = (event) => {
    setTextToSpeak(event.target.value);
  };

  const handleSpeak = () => {
    synthesizer.speakTextAsync(
      textToSpeak,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Synthesis finished.");
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you update the subscription info?"
          );
        }
        synthesizer.close();
      },
      (err) => {
        console.trace("Error - " + err);
        synthesizer.close();
      }
    );
  };

  return (
    <div>
      <input
        type="text"
        className={styles.inputText}
        value={textToSpeak}
        onChange={handleInputChange}
        placeholder="Type text to speak..."
      />
      <button className={styles.btnSpeak} onClick={handleSpeak}>
        Speak
      </button>
    </div>
  );
};

export default TextToSpeechComponent;
