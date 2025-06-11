
// App.jsx - Rewritten to match target.html style

import React, { useEffect, useState } from "react";
import "./index.css";

const players = ["A", "B", "C", "D"];
const suspectsList = Array.from({ length: 8 }, (_, i) => `Suspect ${i + 1}`);

const App = () => {
  const [screen, setScreen] = useState("intro"); // intro, selection, game
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [gameData, setGameData] = useState(null);

  const [revealedClues, setRevealedClues] = useState({ A: [], B: [], C: [], D: [] });
  const [revealedAnswers, setRevealedAnswers] = useState({ A: {}, B: {}, C: {}, D: {} });
  const [groupGuess, setGroupGuess] = useState({ culprit: "", weapon: "", place: "" });
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [activeSuspect, setActiveSuspect] = useState(null);

  useEffect(() => {
    fetch("/data/gameData.json")
      .then((res) => res.json())
      .then((data) => setGameData(data));
  }, []);

  if (!gameData) return <div className="text-center mt-20 text-white">Loading game data...</div>;

  const playerClues = gameData.players[selectedPlayer]?.clues || [];
  const playerQuestions = gameData.players[selectedPlayer]?.questions || {};

  const handleRevealClue = (index) => {
    setRevealedClues((prev) => ({
      ...prev,
      [selectedPlayer]: prev[selectedPlayer].includes(index)
        ? prev[selectedPlayer]
        : [...prev[selectedPlayer], index],
    }));
  };

  const handleAskQuestion = (suspect, qIndex) => {
    setRevealedAnswers((prev) => {
      const playerAnswers = prev[selectedPlayer] || {};
      if (playerAnswers[suspect]) return prev;
      return {
        ...prev,
        [selectedPlayer]: {
          ...playerAnswers,
          [suspect]: [qIndex],
        },
      };
    });
  };

  const renderIntroScreen = () => (
    <div className="text-center py-16">
      <h2 className="title text-4xl font-bold mb-6 text-amber-400">The Mystery Begins</h2>
      <p className="text-xl mb-4 max-w-2xl mx-auto text-center">
  Welcome to the collaborative detective game. Four detectives must work together to solve a mysterious crime by gathering clues and interrogating suspects.
</p>
<p className="text-xl mb-4 max-w-2xl mx-auto text-center">
  Each detective will receive unique clues and can ask different questions to the suspects. Share your findings with each other to identify the culprit!
</p>

      <button
        onClick={() => setScreen("selection")}
        className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Begin Investigation
      </button>
    </div>
  );

  const renderDetectiveSelection = () => (
    <div>
      <h2 className="title text-3xl font-bold mb-6 text-amber-400 text-center">Choose Your Detective</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {players.map((p) => (
          <div
            key={p}
            className={`detective-card bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer`}
            onClick={() => {
              setSelectedPlayer(p);
              setScreen("game");
            }}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 ${
              p === "A" ? "bg-red-700" : p === "B" ? "bg-blue-700" : p === "C" ? "bg-green-700" : "bg-purple-700"
            }`}>{p}</div>
            <h3 className="title text-xl font-bold text-center mb-2">Detective {p}</h3>
            <p className="text-center text-gray-400">Investigator</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGameScreen = () => (
  <div className="space-y-6 mt-10">
    
    {/* The Case - Full Width */}
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="title text-2xl font-bold mb-4 text-amber-400">The Case</h2>
      <div className="text-gray-300 space-y-4 leading-relaxed">
        {gameData.story.split("\n").map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </div>

    {/* BELOW: Grid Columns */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Clues */}
      <div>
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="title text-2xl font-bold text-amber-400">Your Clues</h2>
            <span className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gray-700">{selectedPlayer}</span>
          </div>
          <div className="space-y-4">
            {playerClues.map((clue, index) => (
              <div key={index} className="clue-card bg-gray-700 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-600" onClick={() => handleRevealClue(index)}>
                <h3 className="font-bold text-amber-400">Clue #{index + 1}</h3>
                <p className="text-gray-300">{revealedClues[selectedPlayer].includes(index) ? clue : "Click to reveal"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suspects */}
      <div>
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="title text-2xl font-bold mb-4 text-amber-400">Suspects</h2>
          <div className="space-y-3">
            {suspectsList.map((suspect, i) => (
              <div
                key={i}
                className="suspect-card p-3 bg-gray-700 rounded-lg flex items-center cursor-pointer"
                onClick={() => setActiveSuspect(suspect)}
              >
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">{i + 1}</div>
                <div>
                  <h3 className="font-bold">{suspect}</h3>
                  <p className="text-sm text-gray-400">Click to interrogate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notebook + Final Guess */}
      <div>
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="title text-2xl font-bold mb-4 text-amber-400">Detective's Notebook</h2>
          <div className="notebook-paper p-4 text-gray-800">
            <textarea className="w-full h-40 bg-transparent border-none resize-none focus:outline-none focus:ring-0" placeholder="Write your notes here..." />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="title text-2xl font-bold mb-4 text-amber-400">Solve the Case</h2>
          <input className="w-full p-2 mb-2 bg-gray-700 rounded text-white" placeholder="Culprit (e.g., Suspect 5)" value={groupGuess.culprit} onChange={(e) => setGroupGuess({ ...groupGuess, culprit: e.target.value })} />
          <input className="w-full p-2 mb-2 bg-gray-700 rounded text-white" placeholder="Weapon" value={groupGuess.weapon} onChange={(e) => setGroupGuess({ ...groupGuess, weapon: e.target.value })} />
          <input className="w-full p-2 mb-4 bg-gray-700 rounded text-white" placeholder="Place" value={groupGuess.place} onChange={(e) => setGroupGuess({ ...groupGuess, place: e.target.value })} />
          <button
            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all duration-300"
            onClick={() => {
              const correct = gameData.solution;
              const match = correct &&
                groupGuess.culprit.toLowerCase() === correct.culprit.toLowerCase() &&
                groupGuess.weapon.toLowerCase() === correct.weapon.toLowerCase() &&
                groupGuess.place.toLowerCase() === correct.place.toLowerCase();
              setIsCorrect(match);
              setGuessSubmitted(true);
            }}
            disabled={guessSubmitted}
          >
            Submit Solution
          </button>
          {guessSubmitted && (
            <div className={`mt-4 p-3 rounded text-center ${isCorrect ? "bg-green-500" : "bg-red-500"} text-white`}>
              {isCorrect ? "🎉 Correct! Well done!" : "❌ Incorrect. Try again!"}
              <div className="text-sm mt-2">
                Correct Answer: <strong>{gameData.solution.culprit}</strong> with <strong>{gameData.solution.weapon}</strong> in <strong>{gameData.solution.place}</strong><br />
                <strong>{gameData.solution.explanation}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div> {/* end of grid */}
  </div> // end of space-y wrapper
);


  const renderInterviewModal = () => {
    if (!activeSuspect) return null;
    const questions = playerQuestions[activeSuspect] || [];
    const suspectAnswers = gameData.suspects[activeSuspect]?.answers?.[selectedPlayer] || [];

    const alreadyAskedIndex = revealedAnswers[selectedPlayer]?.[activeSuspect]?.[0];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="title text-2xl font-bold text-amber-400">{activeSuspect}</h2>
            <button onClick={() => setActiveSuspect(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          <div className="space-y-3">
            {questions.map((q, qIndex) => {
              const isRevealed = alreadyAskedIndex === qIndex;
              const isDisabled = alreadyAskedIndex !== undefined && alreadyAskedIndex !== qIndex;
              return (
                <button
                  key={qIndex}
                  onClick={() => handleAskQuestion(activeSuspect, qIndex)}
                  disabled={isDisabled}
                  className={`question-btn w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isRevealed ? suspectAnswers[qIndex] || "No answer" : q}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#e6e6e6] px-4 pb-10">
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 shadow-lg mb-4">
        <div className="container mx-auto flex items-center">
          <div className="text-amber-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ff6b6b" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
          </div>
          <h1 className="title text-3xl font-bold text-white">Mystery Detective Game</h1>
        </div>
      </header>
      {screen === "intro" && renderIntroScreen()}
      {screen === "selection" && renderDetectiveSelection()}
      {screen === "game" && renderGameScreen()}
      {renderInterviewModal()}
    </div>
  );
};

export default App;
