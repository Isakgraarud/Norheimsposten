import { useEffect, useState } from "react";
import '../styles/np-front-page.css';

export default function TypewriterLoader() {
  const text = ["venter på at Simon skal skrive litt ...",
     "Simon må bare kjøpe en 6'er før det stenger ...", 
     "Vent litt, Simon skriver...",
     "Det er kake i messa, kan ta litt tid ...",
     "Tror du Norheimsposten skriver seg selv?",
     "Hvert minutt går det 60 sekunder i afrika"][Math.floor(Math.random() * 6)];

  const [displayed, setDisplayed] = useState("");

useEffect(() => {
  let i = 0;

  const interval = setInterval(() => {
    setDisplayed(prev => text.slice(0, i + 1));
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => {
        
      }, 5000);
    }
  }, 60);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="loader-container">
      <p className="typewriter">
        {displayed}
        <span className="cursor">|</span>
      </p>
    </div>
  );
}