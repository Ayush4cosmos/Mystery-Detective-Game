import React, { useState } from "react";
import PlayerSelector from "../components/PlayerSelector";
import CluesSection from "../components/CluesSection";
import SuspectsSection from "../components/SuspectsSection";

const GamePage = () => {
  const [selectedPlayer, setSelectedPlayer] = useState("A");
  const [revealedClues, setRevealedClues] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const handleRevealClue = (clueId) => {
    setRevealedClues({ ...revealedClues, [clueId]: true });
  };

  const handleAskQuestion = (suspect, questionId) => {
    const key = `${suspect}_${questionId}_P${selectedPlayer}`;
    setRevealedAnswers({ ...revealedAnswers, [key]: true });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Mystery Detective Game</h1>
      <PlayerSelector selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />
      <CluesSection
        selectedPlayer={selectedPlayer}
        revealedClues={revealedClues}
        handleRevealClue={handleRevealClue}
      />
      <SuspectsSection
        selectedPlayer={selectedPlayer}
        revealedAnswers={revealedAnswers}
        handleAskQuestion={handleAskQuestion}
      />
    </div>
  );
};

export default GamePage;