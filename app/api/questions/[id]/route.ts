import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching question with ID:', params.id);
    
    const client = await clientPromise;
    const db = client.db('quiz-app');
    
    console.log('Connected to database');
    
    const question = await db
      .collection('questions')
      .findOne({ _id: new ObjectId(params.id) });

    console.log('Question found:', question);

    if (question) {
      return NextResponse.json(question);
    } else {
      console.log('No question found with ID:', params.id);
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Detailed error fetching question:', error);
    return NextResponse.json({ 
      message: 'Error fetching question', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('quiz-app');
    const data = await request.json();

    // Validation
    if (!data.question || !data.options || data.answer === undefined) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    // Ensure options is an array and has at least 2 options
    if (!Array.isArray(data.options) || data.options.length < 2) {
      return NextResponse.json({ message: 'At least 2 options required' }, { status: 400 });
    }

    // Ensure answer is within the range of options
    if (data.answer < 0 || data.answer >= data.options.length) {
      return NextResponse.json({ message: 'Invalid answer index' }, { status: 400 });
    }

    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          question: data.question.trim(),
          options: data.options.map((opt: string) => opt.trim()),
          answer: data.answer,
        },
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: 'Question updated successfully' });
    } else {
      return NextResponse.json({ message: 'No changes made' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ message: 'Error updating question' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('quiz-app');
    const data = await request.json();
    
    // Validate ObjectId
    let questionId;
    try {
      questionId = new ObjectId(params.id);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid question ID' }, 
        { status: 400 }
      );
    }

    const result = await db.collection('questions').deleteOne({
      _id: questionId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Question not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Question deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { message: 'Failed to delete question' }, 
      { status: 500 }
    );
  }
}