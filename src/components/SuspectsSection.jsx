import React from "react";

const suspects = Array.from({ length: 8 }, (_, i) => `Suspect ${i + 1}`);

const SuspectsSection = ({ selectedPlayer, revealedAnswers, handleAskQuestion }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Interrogate Suspects</h2>
      <div className="grid grid-cols-2 gap-4">
        {suspects.map((suspect, sIndex) => (
          <div key={sIndex} className="border p-4 rounded shadow">
            <h2 className="font-bold mb-2">{suspect}</h2>
            <div className="space-y-2">
              {[1, 2, 3].map((qIndex) => {
                const key = `${suspect}_${qIndex}_P${selectedPlayer}`;
                const alreadyAsked = Object.keys(revealedAnswers).some(k =>
                  k.startsWith(`${suspect}_`) && k.endsWith(`P${selectedPlayer}`)
                );
                return (
                  <button
                    key={qIndex}
                    className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                    onClick={() => handleAskQuestion(suspect, qIndex)}
                    disabled={alreadyAsked}
                  >
                    {revealedAnswers[key] ? `Answer to Q${qIndex}` : `Ask Q${qIndex}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspectsSection;