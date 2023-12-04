"use client";

import { useState, useEffect, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { saveAs } from "file-saver";

// styles
import styles from "./Components.module.scss";

// MUI
import { PlayArrow } from "@mui/icons-material";
import { Pause } from "@mui/icons-material";
import { set } from "mongoose";

const SPEECH_KEY = process.env.NEXT_PUBLIC_SPEECH_KEY;
const SPEECH_REGION = process.env.NEXT_PUBLIC_SPEECH_REGION;

const SpeechToTextComponent = ({ classActiveId }) => {
  // console.log("classActiveText", classActiveText);
  const [isListening, setIsListening] = useState(false);
  const speechConfig = useRef(null);
  const audioConfig = useRef(null);
  const recognizer = useRef(null);
  const [recognizingTranscript, setRecognizingTranscript] = useState("");
  const [recognizedTranscript, setRecognizedTranscript] = useState("");
  const transcriptRef = useRef(null);

  useEffect(() => {
    // fetch data to GET textTranscript from DB

    // *delete classID.js already, work fine on localhost

    const fetchTextTranscript = async () => {
      const url = `/api/class/${classActiveId}?classId=${classActiveId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log("from SpeechToTextComponent.js > fetchTextTranscript ", data);
      setRecognizedTranscript(data.textTranscript);
    };
    fetchTextTranscript();
  }, [classActiveId]);

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

    // recognizer.current.startContinuousRecognitionAsync(() => {
    //   setIsListening(true);
    // });

    return () => {
      recognizer.current.stopContinuousRecognitionAsync(() => {
        setIsListening(false);
      });
    };
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [recognizedTranscript]);

  // const textDBConnection = async () => {
  //   try {
  //     const url = "https://hear-able.vercel.app/api/testApi";
  //     const response = await fetch(url);

  //     if (response.ok) {
  //       const text = await response.json();
  //       console.log(text?.message);
  //     } else {
  //       const errorText = await response.text(); // Assuming error response is text
  //       console.log(`Error: ${response.status}`, JSON.stringify(errorText));
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  const pauseListening = () => {
    setIsListening(false);
    recognizer.current.stopContinuousRecognitionAsync();
  };

  const resumeListening = () => {
    if (!isListening) {
      setIsListening(true);
      recognizer.current.startContinuousRecognitionAsync();
      putTextToDB(recognizedTranscript);
    } else {
      setIsListening(false);
      recognizer.current.stopContinuousRecognitionAsync();
      putTextToDB(recognizedTranscript);
    }
  };

  const putTextToDB = async (text) => {
    const url = "/api/class";

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: classActiveId,
        transcript: text,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    console.log(data);
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
      <div
        style={{
          maxHeight: "70vh",
          overflow: "scroll",
          background: "hsl(0, 0%, 48%)",
          // height: "70vh",
          borderRadius: "16px",
          width: "100%",
          padding: "16px",
        }}
        ref={transcriptRef}
      >
        <div className={styles.transcriptText} style={{ width: "100%" }}>
          <p>{recognizedTranscript}</p>
        </div>
        <div
          className={styles.transcriptText}
          style={{
            border: "solid",
            borderWidth: "2px",
            borderRadius: "8px",
            padding: ".5rem",
          }}
        >
          Listening... : {recognizingTranscript}
        </div>
      </div>
      <div className={styles.btnContainer}>
        <button
          className={`${styles.btn} ${isListening ? `${styles.btnglow}` : ""}`}
          onClick={resumeListening}
        >
          {isListening ? <Pause></Pause> : <PlayArrow></PlayArrow>}
        </button>
        {/* <button className={styles.btn} onClick={pauseListening}>
          Pause Listening
        </button>
        <button className={styles.btn} onClick={stopListening}>
          Stop Listening
        </button>
        <button className={styles.btn} onClick={textDBConnection}>
          Test Database
        </button> */}
      </div>
    </>
  );
};

export default SpeechToTextComponent;
