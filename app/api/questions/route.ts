import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const questionsCollection = db.collection("questions");

    const questions = await questionsCollection.find({}).toArray();

    const formattedQuestions: Question[] = questions.map(question => ({
      id: question._id.toString(),
      question: question.question,
      options: question.options,
      answer: question.answer
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error: unknown) {

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching questions", error: error.message },
        { status: 500 } 
      );
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const data: Question = await req.json();

    const client = await clientPromise;
    const db = client.db("quiz-app");
    const questionsCollection = db.collection("questions");

    const result = await questionsCollection.insertOne(data);

    if (result.insertedId) {
      return NextResponse.json(
        { message: "Question added successfully!" },
        { status: 201 } // HTTP 201 Created
      );
    } else {
      return NextResponse.json(
        { message: "Failed to add the question" },
        { status: 400 } // HTTP 400 Bad Request
      );
    }
  } catch (error: unknown) {
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error adding question", error: error.message },
        { status: 500 } // HTTP 500 Internal Server Error
      );
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}