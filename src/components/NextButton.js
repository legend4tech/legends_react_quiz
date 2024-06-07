import { useEffect } from "react";

function NextButton({ dispatch, answer, index, numQuestions }) {
  useEffect(
    function () {
      function callback() {
        if (answer === null) return null;

        if (index < numQuestions - 1) dispatch({ type: "nextQuestion" });
        if (index === numQuestions - 1) dispatch({ type: "finish" });
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [dispatch, answer, index, numQuestions]
  );

  // if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
