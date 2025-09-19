import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'public', 'data');
const dataFile = path.join(dataDir, 'surveys.json');

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

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    const initialData: SurveyData = {
      surveys: [],
      metadata: {
        total_responses: 0,
        created_at: new Date().toISOString()
      }
    };
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')) as SurveyData;
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
    ensureDataFile();

    const body = await request.json();
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')) as SurveyData;

    const newSurvey: Survey = {
      id: Date.now(),
      responses: body.responses,
      timestamp: new Date().toISOString()
    };

    data.surveys.push(newSurvey);
    data.metadata.total_responses = data.surveys.length;

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

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