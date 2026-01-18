import React from "react";

const Loading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <svg viewBox="25 25 50 50" className="loader_svg">
        <circle r="20" cy="50" cx="50" className="circle"></circle>
      </svg>
    </div>
  );
};

export default Loading;
