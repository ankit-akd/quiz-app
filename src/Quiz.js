import React, { useState, useEffect } from "react";
import axios from "axios";

function MainQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [myAnswer, setMyAnswer] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userResponses, setUserResponses] = useState([]);
  const [timer, setTimer] = useState(30*60);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !isEnd) {
      const timerInterval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    } else if (timer === 0 && !isEnd) {
      finishHandler();
    }
  }, [timer, isEnd]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=15"
      );
      const quizData = response.data.results;
      if (quizData.length > 0) {
        setQuestions(quizData);
        setOptions([
          ...quizData[0].incorrect_answers,
          quizData[0].correct_answer,
        ]);
        setLoading(false);
        setUserResponses(Array(quizData.length).fill(null)); 
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const nextQuestionHandler = () => {
    if (myAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setOptions([
        ...questions[currentQuestion + 1].incorrect_answers,
        questions[currentQuestion + 1].correct_answer,
      ]);
      setMyAnswer(null);
      setDisabled(true);
      setVisitedQuestions([...visitedQuestions, currentQuestion]);
    } else {
      setIsEnd(true);
    }
  };

  const goToQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentQuestion(questionIndex);
      setOptions([
        ...questions[questionIndex].incorrect_answers,
        questions[questionIndex].correct_answer,
      ]);
      setVisitedQuestions([...visitedQuestions, questionIndex]);
    }
  };

  const checkAnswer = (answer) => {
    setMyAnswer(answer);
    setDisabled(false);

    const updatedUserResponses = [...userResponses];
    updatedUserResponses[currentQuestion] = answer;
    setUserResponses(updatedUserResponses);

    setAttemptedQuestions([...attemptedQuestions, currentQuestion]);
  };

  const finishHandler = () => {
    setIsEnd(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  const isQuestionVisited = (questionIndex) =>
    visitedQuestions.includes(questionIndex);
  const isQuestionAttempted = (questionIndex) =>
    attemptedQuestions.includes(questionIndex);

  if (isEnd) {
    return (
      <div className="result">
        <h3>Quiz Over!! Your Final score is {score} points</h3>
        <div>
          <h4>Quiz Report:</h4>
          <ul>
            {questions.map((item, index) => (
              <li key={index}>
                <strong>Question:</strong> {item.question}<br />
                <strong>Your Answer:</strong> {userResponses[index]}<br />
                <strong>Correct Answer:</strong> {item.correct_answer}<br />
                <br></br>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <div>
          <span>Time Left: {formatTime(timer)}</span>
          <div>
            <strong style={{ float: "left" }}>Question Overview:</strong>
            <ul className="question-list">
              {questions.map((question, index) => (
                <li key={index}>
                  <span
                    onClick={() => goToQuestion(index)}
                    className={`question-link ${
                      isQuestionVisited(index) ? "visited" : ""
                    } ${isQuestionAttempted(index) ? "attempted" : ""}`}
                  >
                    {index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h1>{questions[currentQuestion].question} </h1>
        <span>{`Questions ${currentQuestion + 1}  out of ${
          questions.length
        } remaining`}</span>
        {options.map((option, index) => (
          <p
            key={index}
            className={`ui floating message options ${
              myAnswer === option ? "selected" : null
            }`}
            onClick={() => checkAnswer(option)}
          >
            {option}
          </p>
        ))}
        {currentQuestion < questions.length - 1 && (
          <button
            className="ui inverted button"
            disabled={disabled}
            onClick={nextQuestionHandler}
          >
            Next
          </button>
        )}
        {currentQuestion === questions.length - 1 && (
          <button className="ui inverted button" onClick={finishHandler}>
            Finish
          </button>
        )}
      </div>
    );
  }
}

export default MainQuiz;
