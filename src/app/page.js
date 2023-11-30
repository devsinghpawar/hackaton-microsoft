// components
import SpeechToTextComponent from "../../components/SpeechToTextComponent";
import TextToSpeechComponent from "../../components/TextToSpeechComponent";

// styles
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 style={{ color: "white" }}>Microsoft Hackaton Project</h1>
      <SpeechToTextComponent />
      <TextToSpeechComponent />
    </main>
  );
}
