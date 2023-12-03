import React from "react";

// components
import SpeechToTextComponent from "../components/SpeechToTextComponent";
import TextToSpeechComponent from "../components/TextToSpeechComponent";

function PlayScreen({ classActiveId}) {
  return (
    <div style={{height:"85vh", maxHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", flexGrow:1, justifyContent:"flex-end"}}>
      <SpeechToTextComponent classActiveId={classActiveId}/>
      <TextToSpeechComponent />
    </div>
  );
}

export default PlayScreen;
