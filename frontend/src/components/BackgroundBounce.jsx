import React from "react";
import ocrimg from "../5264470.png"; // path is from /components

export default function BackgroundBounce() {
  return (
    <div className="bg-bounce" aria-hidden="true">
      <img src={ocrimg} alt="" className="bg-bounce__img" />
      <div className="bg-bounce__shadow" />
    </div>
  );
}
