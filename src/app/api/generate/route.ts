import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a spreadsheet generation assistant. Generate a JSON structure for a spreadsheet based on the user's request.
          The response should include:
          - headers: array of column names
          - data: array of rows with sample data
          - formulas: array of Excel-style formulas to be applied
          Keep the response focused and practical.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const spreadsheetStructure = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(spreadsheetStructure);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate spreadsheet' }, { status: 500 });
  }
} 