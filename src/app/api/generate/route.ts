import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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
          content: `You are an AI assistant that creates spreadsheets. Provide two outputs:
          1. A description of the spreadsheet
          2. A JSON structure with headers and formulas.
          
          Return your response in this format:
          ---DESCRIPTION---
          [Your description here]
          ---STRUCTURE---
          {
            "headers": ["Column1", "Column2", ...],
            "formulas": [
              {"cell": "C1", "formula": "=A1+B1"}
            ]
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const response = completion.choices[0].message.content || '';
    
    // Parse the response
    const [description, structureStr] = response.split('---STRUCTURE---');
    const cleanDescription = description.replace('---DESCRIPTION---', '').trim();
    
    let structure = { headers: [], formulas: [] };
    try {
      structure = JSON.parse(structureStr.trim());
    } catch (e) {
      console.error('Failed to parse structure:', e);
    }

    return NextResponse.json({ 
      result: cleanDescription,
      structure,
      success: true 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate spreadsheet structure',
      success: false 
    }, { status: 500 });
  }
} 