'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
}

export default function EditQuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleDeleteQuestion = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this question?');
    
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/questions/${id}`, {
          method: 'DELETE',
          body: JSON.stringify({}), 
        });

        if (!response.ok) {
          throw new Error('Failed to delete question');
        }

        setQuestions(questions.filter(q => q.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'An error occurred while deleting the question');
      }
    }
  };

  const handleEditQuestion = (id: string) => {
    router.push(`/quiz/edit/${id}`);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Manage Questions</h1>
        
        {questions.length === 0 ? (
          <div className="text-center text-gray-500">
            No questions available. 
            <Link href="/quiz/add" className="text-blue-500 ml-2 underline">
              Add a question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div 
                key={q.id} 
                className="flex justify-between items-center border-b pb-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-grow mr-4">
                  <p className="font-semibold">{q.question}</p>
                  <p className="text-sm text-gray-500">
                    Options: {q.options.join(', ')}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditQuestion(q.id)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                  >
                    <Edit />
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}