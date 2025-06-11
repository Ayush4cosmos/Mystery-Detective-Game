import React, { useEffect, useState } from "react";

const players = ["A", "B", "C", "D"];
const suspectsList = Array.from({ length: 8 }, (_, i) => `Suspect ${i + 1}`);

const App = () => {
  const [selectedPlayer, setSelectedPlayer] = useState("A");
  const [gameData, setGameData] = useState(null);

  const [revealedClues, setRevealedClues] = useState({
    A: [],
    B: [],
    C: [],
    D: []
  });

  const [revealedAnswers, setRevealedAnswers] = useState({
    A: {},
    B: {},
    C: {},
    D: {}
  });

  const [groupGuess, setGroupGuess] = useState({ culprit: "", weapon: "", place: "" });
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    fetch("/data/gameData.json")
      .then((res) => res.json())
      .then((data) => setGameData(data));
  }, []);

  const handleRevealClue = (index) => {
    setRevealedClues((prev) => ({
      ...prev,
      [selectedPlayer]: prev[selectedPlayer].includes(index)
        ? prev[selectedPlayer]
        : [...prev[selectedPlayer], index]
    }));
  };

  const handleAskQuestion = (suspect, qIndex) => {
  setRevealedAnswers((prev) => {
    const playerAnswers = prev[selectedPlayer] || {};
    if (playerAnswers[suspect]) return prev; // already asked one

    return {
      ...prev,
      [selectedPlayer]: {
        ...playerAnswers,
        [suspect]: [qIndex]
      }
    };
  });
};
;

  if (!gameData) return <div>Loading game data...</div>;

  const playerClues = gameData.players[selectedPlayer]?.clues || [];
  const playerQuestions = gameData.players[selectedPlayer]?.questions || {};

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">🕵️‍♂️ Mystery Detective Game</h1>
      <p className="italic">{gameData.story}</p>

      <div className="space-x-2">
        {players.map((p) => (
          <button
            key={p}
            className={`px-3 py-1 rounded ${p === selectedPlayer ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={() => setSelectedPlayer(p)}
          >
            Player {p}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Clues for Player {selectedPlayer}</h2>
        <div className="grid grid-cols-2 gap-2">
          {playerClues.map((clue, idx) => (
            <button
              key={idx}
              onClick={() => handleRevealClue(idx)}
              className="bg-blue-200 p-2 rounded hover:bg-blue-300"
            >
              {revealedClues[selectedPlayer].includes(idx) ? clue : `Reveal Clue ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6">Interrogate Suspects</h2>
        <div className="grid grid-cols-2 gap-4">
          {suspectsList.map((suspect) => (
            <div key={suspect} className="border p-3 rounded shadow">
              <h3 className="font-bold">{suspect}</h3>
              <div className="space-y-1">
                {(playerQuestions[suspect] || []).map((q, qIndex) => {
                  const key = `${suspect}_${qIndex}`;
                  const answer = gameData.suspects[suspect]?.answers?.[selectedPlayer]?.[qIndex];

                  const alreadyAskedIndex = revealedAnswers[selectedPlayer]?.[suspect]?.[0];
                  const isRevealed = alreadyAskedIndex === qIndex;
                  const isDisabled = alreadyAskedIndex !== undefined && alreadyAskedIndex !== qIndex;

                  return (
                    <button
                      key={key}
                      onClick={() => handleAskQuestion(suspect, qIndex)}
                      disabled={isDisabled}
                      className={`p-1 rounded w-full ${
                        isRevealed
                          ? "bg-green-100 text-gray-700"
                          : isDisabled
                          ? "bg-gray-100 text-gray-400"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {isRevealed ? answer || "No answer" : q}
                    </button>
                  );
                })}

              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-4 border rounded shadow space-y-4">
        <h2 className="text-xl font-bold">Group Final Guess</h2>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Culprit (e.g., Suspect 4)"
            value={groupGuess.culprit}
            onChange={(e) => setGroupGuess({ ...groupGuess, culprit: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Weapon"
            value={groupGuess.weapon}
            onChange={(e) => setGroupGuess({ ...groupGuess, weapon: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Place"
            value={groupGuess.place}
            onChange={(e) => setGroupGuess({ ...groupGuess, place: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={() => {
            const correct = gameData.solution;
            const match =
              correct &&
              groupGuess.culprit.toLowerCase() === correct.culprit.toLowerCase() &&
              groupGuess.weapon.toLowerCase() === correct.weapon.toLowerCase() &&
              groupGuess.place.toLowerCase() === correct.place.toLowerCase();

            setIsCorrect(match);
            setGuessSubmitted(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={guessSubmitted}
        >
          Submit Final Guess
        </button>

        {guessSubmitted && (
          <div className={`p-3 rounded ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
            {isCorrect ? "🎉 Correct! Well done, detectives!" : "❌ Incorrect. Better luck next time!"}
            <div className="mt-2 text-sm">
              Correct Answer:{" "}
              <strong>{gameData.solution.culprit}</strong> with{" "}
              <strong>{gameData.solution.weapon}</strong> in{" "}
              <strong>{gameData.solution.place}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
