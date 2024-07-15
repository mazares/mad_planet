import "./Message.css";

import { useEffect, useState, useCallback } from "react";

export default function Message() {
  const language: string[] = [`Typescript`, `JavaScript`, `React`];

  const atribute: string[] = [`Awesome!!!`, `Cool!!!`, `Amazing!!!`];

  const [languageIndex, setLanguageIndex] = useState(0);
  const [atributeIndex, setAtributeIndex] = useState(0);

  const changeLanguage = useCallback(() => {
    setLanguageIndex(() => Math.floor(Math.random() * language.length));
  }, [language]);

  const changeAtribute = useCallback(() => {
    setAtributeIndex(() => Math.floor(Math.random() * atribute.length));
  }, [atribute]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeLanguage();
      changeAtribute();
    }, 2000);
    return () => clearInterval(interval);
  }, [changeLanguage, changeAtribute]);

  return (
    <div className="message">
      <h2>{language[languageIndex]}</h2>
      <h3>is</h3>
      <h1>{atribute[atributeIndex]}</h1>
    </div>
  );
}
