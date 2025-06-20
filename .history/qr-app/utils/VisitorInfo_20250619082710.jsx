import React from "react";

export const VisitorInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,,
    plateform:navigator.platform,
    screen:{
        width:window.screen.width,
        height:window.screen.height
    },
    timezone:Intl.DateTimeFormat
  };
};
