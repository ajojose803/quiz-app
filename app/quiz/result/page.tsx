"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trophy, Repeat, Home } from "lucide-react";

export default function ResultPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const answersFromQuery = queryParams.get("answers");
    if (answersFromQuery) {
      setAnswers(JSON.parse(answersFromQuery));
    }

    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const calculateResults = () => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (questions[index]?.answer === answer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const calculatePercentage = () => {
    return questions.length > 0 
      ? Math.round((calculateResults() / questions.length) * 100) 
      : 0;
  };

  const getResultMessage = () => {
    const percentage = calculatePercentage();
    if (percentage === 100) return "Perfect Score!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Not Bad, Keep Practicing!";
    return "Keep Learning!";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-pulse text-xl text-gray-600">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 text-center max-w-md w-full space-y-6 transform transition-all hover:scale-105 duration-300">
        <div className="flex justify-center mb-4">
          <Trophy 
            className="w-16 h-16 text-yellow-500 animate-bounce" 
            strokeWidth={1.5}
          />
        </div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          {getResultMessage()}
        </h2>

        <div className="bg-blue-50 rounded-lg p-4 shadow-inner">
          <p className="text-xl font-semibold text-gray-700">
            You scored {calculateResults()} out of {questions.length}
          </p>
          <p className="text-lg text-gray-600 mt-2">
            {calculatePercentage()}% Correct
          </p>
        </div>

        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => router.push("/quiz/start")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Repeat className="w-5 h-5" />
            <span>Retry Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}