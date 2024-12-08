'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Home, CheckCircle, XCircle } from 'lucide-react';

const AddQuestionForm = () => {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        question, 
        options, 
        answer: answer - 1  // Convert to 0-index for storage
      }),
    });

    if (response.ok) {
      setMessage("Question added successfully!");
      // Clear form after successful submission
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer(1);
    } else {
      setMessage("Failed to add question.");
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md space-y-6 transform transition-all hover:scale-105 duration-300">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Create a Question
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Add a new quiz question with multiple choice options
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="question" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Question Text
            </label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="Enter your question here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options
            </label>
            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              ))}
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="correct-option" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Correct Answer
            </label>
            <select
              id="correct-option"
              value={answer}
              onChange={(e) => setAnswer(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              {options.map((_, index) => (
                <option key={index} value={index + 1}>
                  Option {index + 1}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Choose the option that is the correct answer
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button 
              type="submit" 
              className="flex-grow flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Question</span>
            </button>
            
            <button 
              type="button"
              onClick={handleGoHome}
              className="flex-grow flex items-center justify-center space-x-2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Back Home</span>
            </button>
          </div>
        </form>
        
        {message && (
          <div 
            className={`mt-4 p-3 rounded-lg flex items-center justify-center space-x-2 ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.includes('successfully') ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddQuestionForm;