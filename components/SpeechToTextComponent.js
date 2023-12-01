"use client";

import { useState, useEffect, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { saveAs } from "file-saver";

// styles
import styles from "./Components.module.scss";

const SPEECH_KEY = process.env.NEXT_PUBLIC_SPEECH_KEY;
const SPEECH_REGION = process.env.NEXT_PUBLIC_SPEECH_REGION;

const SpeechToTextComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const speechConfig = useRef(null);
  const audioConfig = useRef(null);
  const recognizer = useRef(null);
  const [recognizingTranscript, setRecognizingTranscript] = useState("");
  const [recognizedTranscript, setRecognizedTranscript] = useState("");

  useEffect(() => {
    speechConfig.current = sdk.SpeechConfig.fromSubscription(
      SPEECH_KEY,
      SPEECH_REGION
    );
    speechConfig.current.speechRecognitionLanguage = "en-US";

    audioConfig.current = sdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer.current = new sdk.SpeechRecognizer(
      speechConfig.current,
      audioConfig.current
    );

    recognizer.current.recognized = (s, e) => {
      const result = e.result;
      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        const timestamp = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const newText = `[${timestamp}] ${result.text}\n`;
        setRecognizedTranscript((prevTranscript) => prevTranscript + newText);
      }
    };

    recognizer.current.recognizing = (s, e) => {
      const result = e.result;
      if (result.reason === sdk.ResultReason.RecognizingSpeech) {
        setRecognizingTranscript(result.text);
      }
    };

    recognizer.current.startContinuousRecognitionAsync(() => {
      setIsListening(true);
    });

    return () => {
      recognizer.current.stopContinuousRecognitionAsync(() => {
        setIsListening(false);
      });
    };
  }, []);

  const textDBConnection = async () => {
    try {
      const url = "https://hear-able.vercel.app/api/testApi";
      const response = await fetch(url);
  
      if (response.ok) {
        const text = await response.json();
        console.log(text?.message);
      } else {
        const errorText = await response.text(); // Assuming error response is text
        console.log(`Error: ${response.status}`, JSON.stringify(errorText));
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  

  const pauseListening = () => {
    setIsListening(false);
    recognizer.current.stopContinuousRecognitionAsync();
  };

  const resumeListening = () => {
    if (!isListening) {
      setIsListening(true);
      recognizer.current.startContinuousRecognitionAsync();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognizer.current.stopContinuousRecognitionAsync(() => {
      saveTranscript(recognizedTranscript);
    });
  };

  const saveTranscript = (transcript) => {
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "transcript.txt");
  };

  return (
    <>
      <div className={styles.btnContainer}>
        <button className={styles.btn} onClick={resumeListening}>
          Resume Listening
        </button>
        <button className={styles.btn} onClick={pauseListening}>
          Pause Listening
        </button>
        <button className={styles.btn} onClick={stopListening}>
          Stop Listening
        </button>
        <button className={styles.btn} onClick={textDBConnection}>
          Test Database
        </button>
      </div>
      <div>
        <div className={styles.transcriptText}>
          Recognizing Transcript: {recognizingTranscript}
        </div>
        <div className={styles.transcriptText}>
          Recognized Transcript: {recognizedTranscript}
        </div>
      </div>
    </>
  );
};

export default SpeechToTextComponent;
