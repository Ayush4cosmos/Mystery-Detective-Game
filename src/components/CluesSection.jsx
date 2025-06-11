import React from "react";

const CluesSection = ({ selectedPlayer, revealedClues, handleRevealClue }) => {
  const clues = Array.from({ length: 8 }, (_, i) => `Clue ${i + 1}`);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Clues for Player {selectedPlayer}</h2>
      <div className="grid grid-cols-2 gap-2">
        {clues.map((clue, index) => {
          const clueId = `P${selectedPlayer}_${index}`;
          return (
            <button
              key={index}
              className="bg-blue-200 p-2 rounded hover:bg-blue-300"
              onClick={() => handleRevealClue(clueId)}
            >
              {revealedClues[clueId] ? clue : `Reveal ${clue}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CluesSection;