import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  originalQuestions: [], // Store the original set of questions

  questions: [],

  //"loading","error","ready","active","finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  difficulty: "none",
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        originalQuestions: action.payload, // Store the original questions
        questions:
          state.difficulty === "none"
            ? action.payload
            : action.payload.filter(
                (action) => state.difficulty === action.difficulty
              ),
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    // return {
    //   ...state,
    //   status: "ready",
    //   index: 0,
    //   answer: null,
    //   points: 0,
    //   highScore: 0,
    // };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    case "setDifficulty":
      const newDifficulty = action.payload;
      let filteredQuestions;

      newDifficulty === "none"
        ? (filteredQuestions = state.originalQuestions)
        : (filteredQuestions = state.originalQuestions.filter(
            (question) => question.difficulty === newDifficulty
          ));

      return {
        ...state,
        difficulty: newDifficulty,
        questions: filteredQuestions,
      };

    // Other cases remain unchanged...

    default:
      throw new Error("Action unknown");
  }
}
function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.jsonbin.io/v3/b/666363eeacd3cb34a854398e/latest",
          {
            headers: {
              "X-Master-Key":
                "$2a$10$/r2SORqMVTpcI4h7Lhg.7.bWFuTEYBtPlgzD9sXpbMeG2pCkm6xYu",
            },
          }
        );
        const data = await response.json();
        const { questions } = data.record;
        dispatch({ type: "dataReceived", payload: questions });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    };

    const id = setTimeout(fetchData, 3000);

    return () => clearTimeout(id);
  }, []);

  // useEffect(function () {
  //   const id = setTimeout(function () {
  //     fetch("http://localhost:8000/questions")
  //       .then((res) => res.json())
  //       .then((data) => dispatch({ type: "dataReceived", payload: data }))
  //       .catch((err) => dispatch({ type: "dataFailed" }));
  //   }, 3000);
  //   return () => clearInterval(id);
  //   // fetch("http://localhost:8000/questions")
  //   //   .then((res) => res.json())
  //   //   .then((data) => dispatch({ type: "dataReceived", payload: data }))
  //   //   .catch((err) => dispatch({ type: "dataFailed" }));
  // }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            difficulty={difficulty}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
