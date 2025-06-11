import React from "react";

const PlayerSelector = ({ selectedPlayer, setSelectedPlayer }) => {
  const players = ["A", "B", "C", "D"];
  return (
    <div className="mb-4">
      <label className="font-semibold mr-2">Select Player:</label>
      {players.map((p) => (
        <button
          key={p}
          className={`px-4 py-1 m-1 rounded ${selectedPlayer === p ? "bg-green-400" : "bg-gray-300"}`}
          onClick={() => setSelectedPlayer(p)}
        >
          Player {p}
        </button>
      ))}
    </div>
  );
};

export default PlayerSelector;