import React from "react";

function StartScreen({ numQuestions, dispatch, difficulty }) {
  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    dispatch({ type: "setDifficulty", payload: newDifficulty });
  };

  return (
    <div className="start">
      <h2>Welcome To The React Quiz</h2>
      <h3>{numQuestions} questions to test your React Mastery</h3>
      <h3>Choose Your Difficulty Level Below:</h3>
      <select
        className="select"
        value={difficulty}
        onChange={handleDifficultyChange}
      >
        <option value={"none"}>All Questions</option>
        <option value={"easy"}>Easy</option>
        <option value={"intermediate"}>Intermediate</option>
        <option value={"hard"}>Hard</option>
      </select>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
