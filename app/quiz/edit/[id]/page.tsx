'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // Import use from React

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState(0);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Unwrap params using React.use()
  const { id: questionId } = use(params);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${questionId}`);
        
        if (response.ok) {
          const data = await response.json();
          setQuestion(data.question);
          setOptions(data.options);
          setAnswer(data.answer);
        } else {
          setMessage('Failed to fetch the question. Please try again.');
        }
      } catch (error) {
        setMessage('An unexpected error occurred while fetching the question.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!question.trim()) {
      setMessage('Question cannot be empty.');
      return;
    }

    if (options.some((option) => !option.trim())) {
      setMessage('All options must be filled.');
      return;
    }

    if (answer < 0 || answer >= options.length) {
      setMessage(`Answer must be between 0 and ${options.length - 1}.`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, options, answer }),
      });

      if (response.ok) {
        setMessage('Question updated successfully!');
        setTimeout(() => {
          router.push('/quiz/edit');
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update question.');
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Edit Question
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
              Question
            </label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your question"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  required
                  className="flex-grow px-3 py-2 border rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="answer" className="block text-gray-700 font-medium mb-2">
              Correct Answer (Option Index)
            </label>
            <select
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map((_, index) => (
                <option key={index} value={index}>
                  Option {index + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white font-semibold transition-colors duration-300 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
          >
            {isLoading ? 'Updating...' : 'Update Question'}
          </button>
        </form>

        {message && (
          <p 
            className={`mt-4 text-center ${
              message.includes('successfully') 
                ? 'text-green-600' 
                : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;