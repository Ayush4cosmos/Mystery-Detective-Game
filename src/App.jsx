
// App.jsx - Rewritten to match target.html style

import React, { useEffect, useState } from "react";
import "./index.css";

const players = ["A", "B", "C", "D"];
const suspectsList = Array.from({ length: 8 }, (_, i) => `Suspect ${i + 1}`);

const App = () => {
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [selectedCulprits, setSelectedCulprits] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [partialCorrect, setPartialCorrect] = useState({
  culprits: false,
  method: false,
  location: false
});

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
            <p className="text-center text-gray-400">{gameData.specialties[p]}</p>

          </div>
        ))}
      </div>
    </div>
  );

  const renderGameScreen = () => {
    const suspectColors = [
  "bg-yellow-500",  // 1
  "bg-orange-500",  // 2
  "bg-red-600",     // 3
  "bg-pink-500",    // 4
  "bg-green-500",   // 5
  "bg-blue-600",    // 6
  "bg-purple-600",  // 7
  "bg-teal-500",    // 8
  "bg-rose-500",    // 9
  "bg-cyan-500",    // 10
  "bg-indigo-500",  // 11
  "bg-lime-500"     // 12
];

  return (
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
            {Object.entries(gameData.suspects).map(([suspectKey, suspectData], i) => (
  <div
    key={suspectKey}
    className="suspect-card p-3 bg-gray-700 rounded-lg flex items-center cursor-pointer"
    onClick={() => setActiveSuspect(suspectKey)}
  >
    <div className={`w-12 h-12 ${suspectColors[i % suspectColors.length]} rounded-full flex items-center justify-center text-white font-bold text-xl mr-4`}>

      {i + 1}
    </div>
    <div>
      <h3 className="font-bold text-white">Suspect {i + 1}: {suspectData.name}</h3>
      <p className="font-bold text-sm text-gray-400">{suspectData.description}</p>
      <p className="text-sm text-gray-500 italic">Click to interrogate</p>
    </div>
  </div>
))}

          </div>
        </div>
      </div>

      {/* Notebook + Final Guess */}
      <div>
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg mb-6">
        <h2 className="title text-2xl font-bold mb-4 text-amber-400">Detective's Notebook</h2>
        <textarea
  className="w-full h-40 p-3 text-gray-800 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
  placeholder="Write your notes here..."
  style={{ backgroundColor: '#fdf6e3' }}  // soft yellow paper feel
/>
        {/* <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="title text-2xl font-bold mb-4 text-amber-400">Detective's Notebook</h2>
          <div className="notebook-paper p-4 text-gray-800">
            <textarea className="w-full h-40 bg-transparent border-none resize-none focus:outline-none focus:ring-0" placeholder="Write your notes here..." />
          </div>
        </div> */} 
</div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="title text-2xl font-bold mb-4 text-amber-400">Solve the Case</h2>
          <p className="font-bold text-sm text-gray-300 mb-4">
            When all detectives have gathered their clues and questioned suspects,
            discuss your findings together and submit your solution.
          </p>
          <button
            onClick={() => setShowSolutionModal(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Submit Solution
          </button>
          {guessSubmitted && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 text-white">
      <h2 className="title text-3xl font-bold mb-4 text-amber-400">
        {isCorrect ? "Case Solved!" : "Case Unsolved"}
      </h2>
      {isCorrect && (
  <p className="text-green-400 font-semibold mb-4">
    🎉 Congratulations! You've solved the case completely!
  </p>
)}


      {!isCorrect && (
  <>
    <p className="text-red-400 font-semibold mb-4">Unfortunately, your deductions were incorrect.</p>

    {/* ✅ Partial Feedback */}
    <div className="mb-4 text-white">
      <p className="mb-1 font-semibold">You got:</p>
      <ul className="list-disc list-inside text-sm space-y-1">
        {partialCorrect.culprits && <li>✅ Correctly identified the culprit(s)</li>}
        {partialCorrect.method && <li>✅ Correctly identified the method</li>}
        {partialCorrect.location && <li>✅ Correctly identified the location</li>}
        {!partialCorrect.culprits && !partialCorrect.method && !partialCorrect.location && (
          <li>❌ No part of your guess was correct.</li>
        )}
      </ul>
    </div>
  </>
)}

{/* ✅ Always show the full explanation */}
<div className="text-gray-200 space-y-4 leading-relaxed mt-6">
  <div dangerouslySetInnerHTML={{ __html: gameData.solution.explanation }} />
</div>



      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.reload()}
          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-all duration-300"
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </div> {/* end of grid */}
  </div> // end of space-y wrapper
  );
};


  const renderInterviewModal = () => {
  if (!activeSuspect) return null;

  const questions = playerQuestions[activeSuspect] || [];
  const suspectData = gameData.suspects[activeSuspect];
  const suspectAnswers = suspectData?.answers?.[selectedPlayer] || [];

  const alreadyAskedIndex = revealedAnswers[selectedPlayer]?.[activeSuspect]?.[0];
  const i = Object.keys(gameData.suspects).indexOf(activeSuspect);

  const suspectColors = [
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-600",
    "bg-pink-500",
    "bg-green-500",
    "bg-blue-600",
    "bg-purple-600",
    "bg-teal-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${suspectColors[i % suspectColors.length]} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
              {i + 1}
            </div>
            <div>
              <h2 className="title text-2xl font-bold text-amber-400">{suspectData.name}</h2>
              <p className="text-sm text-gray-300">{suspectData.description}</p>
            </div>
          </div>
          <button onClick={() => setActiveSuspect(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Prompt */}
        <h3 className="text-amber-400 font-bold mb-2 mt-2">Choose one question to ask:</h3>

        {/* Questions */}
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
      {showSolutionModal && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4">
      <h2 className="title text-2xl font-bold mb-6 text-amber-400">Submit Your Solution</h2>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Who is the culprit?</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(gameData.suspects).map((suspect, idx) => (
            <label key={suspect} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={suspect}
                checked={selectedCulprits.includes(suspect)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedCulprits((prev) =>
                    isChecked ? [...prev, suspect] : prev.filter((s) => s !== suspect)
                  );
                }}
              />
              <span className="flex items-center">
                <span className={`w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2`}>
                  {idx + 1}
                </span>
                {suspect}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">What was the method used?</h3>
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded-lg"
        >
          <option value="">Select method...</option>
          {gameData.options.weapons.map((weapon, i) => (
  <option key={i} value={weapon}>{weapon}</option>
))}

        </select>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Where did the crime occur?</h3>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded-lg"
        >
          <option value="">Select location...</option>
          {gameData.options.locations.map((place, i) => (
  <option key={i} value={place}>{place}</option>
))}

        </select>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setShowSolutionModal(false)}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
  const correct = gameData.solution;

  // Handle single or multiple culprits
  const actualCulprits = Array.isArray(correct.culprits)
    ? correct.culprits
    : [correct.culprit];

  const culpritsCorrect =
    JSON.stringify(selectedCulprits.sort()) === JSON.stringify(actualCulprits.sort());

  const methodCorrect = selectedMethod === correct.weapon;
  const locationCorrect = selectedLocation === correct.place;

  const correctCount =
    (culpritsCorrect ? 1 : 0) + (methodCorrect ? 1 : 0) + (locationCorrect ? 1 : 0);

  setIsCorrect(correctCount === 3);
  setPartialCorrect({
    culprits: culpritsCorrect,
    method: methodCorrect,
    location: locationCorrect
  });
  setGuessSubmitted(true);
  setShowSolutionModal(false);
}}

          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

      {renderInterviewModal()}
    </div>
  );
};

export default App;
