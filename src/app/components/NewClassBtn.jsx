import React from "react";
import Image from "next/image";

// images
import IconVoice from "../../../public/icon_voice.svg";
import { Typography } from "@mui/material";


function NewClassBtn({handleOpenModal}) {
  return (
    <div style={{flexGrow:1, display:"flex",alignItems:"center"}}>
    <button onClick={handleOpenModal} 
    
    >
      <Image src={IconVoice} alt="icon voice" width={100} />
      <Typography variant="h6" noWrap component="div">
        Start new classroom
      </Typography>
    </button>
    </div>
  );
}

export default NewClassBtn;
