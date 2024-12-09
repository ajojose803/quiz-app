"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

export default function StartQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching questions...");
        const res = await fetch("/api/questions");
        
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to fetch questions", res.status, errorText);
          return;
        }
        
        const data = await res.json();
        console.log("Fetched questions:", data);
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (optionIndex: number | null) => {
    const updatedAnswers = [...answers, optionIndex];
    setAnswers(updatedAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const query = new URLSearchParams({ answers: JSON.stringify(updatedAnswers) }).toString();
      router.push(`/quiz/result?${query}`);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">No questions yet...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-4 text-center">
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
        </div>
        
        <div className="p-6">
          <p className="text-lg font-medium text-gray-800 mb-6 text-center">
            {currentQuestion.question}
          </p>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className="w-full px-4 py-3 text-left 
                  bg-blue-50 text-blue-800 
                  rounded-lg 
                  hover:bg-blue-100 
                  transition-colors 
                  duration-300 
                  border-2 border-transparent 
                  hover:border-blue-300 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500"
                onClick={() => handleAnswer(idx)}
              >
                {option}
              </button>
            ))}

            <button
              className="w-full px-4 py-3 text-left 
                bg-gray-100 text-gray-700 
                rounded-lg 
                hover:bg-gray-200 
                transition-colors 
                duration-300 
                border-2 border-transparent 
                hover:border-gray-300 
                focus:outline-none 
                focus:ring-2 
                focus:ring-gray-500"
              onClick={() => handleAnswer(null)}
            >
              Skip Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}