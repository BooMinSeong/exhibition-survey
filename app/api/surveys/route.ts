import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface Survey {
  id: number;
  responses: {
    exhibition_name: string;
    first_impression: string;
    memorable_work: string;
    emotional_response: string;
    overall_experience: string;
  };
  timestamp: string;
}

interface SurveyData {
  surveys: Survey[];
  metadata: {
    total_responses: number;
    created_at: string;
  };
}

async function getSurveyData(): Promise<SurveyData> {
  const data = await kv.get<SurveyData>('surveys');
  if (!data) {
    const initialData: SurveyData = {
      surveys: [],
      metadata: {
        total_responses: 0,
        created_at: new Date().toISOString()
      }
    };
    await kv.set('surveys', initialData);
    return initialData;
  }
  return data;
}

export async function GET() {
  try {
    const data = await getSurveyData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading surveys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surveys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await getSurveyData();

    const newSurvey: Survey = {
      id: Date.now(),
      responses: body.responses,
      timestamp: new Date().toISOString()
    };

    data.surveys.push(newSurvey);
    data.metadata.total_responses = data.surveys.length;

    await kv.set('surveys', data);

    return NextResponse.json(
      { success: true, id: newSurvey.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving survey:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}