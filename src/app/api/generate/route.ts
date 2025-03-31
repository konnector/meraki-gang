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
          content: `You are an AI assistant specialized in creating clear, practical spreadsheet structures. 
          
          Format your responses following this structure:
          1. Start with a brief title in bold
          2. Add a one-line description of the spreadsheet's purpose
          
          ## Column Structure
          - List each column with its purpose
          - Use \`A1\` format for cell references
          - Include sample values where helpful
          
          ## Formulas and Calculations
          - Show exact formulas using \`=FORMULA()\` format
          - Explain each formula's purpose
          - Include any conditional formatting rules
          
          ## Tips
          - Add practical usage tips
          - Mention any important considerations
          
          Keep everything concise and practical. Focus on making the spreadsheet immediately usable.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    // Process the response to ensure proper markdown rendering
    const formattedResponse = completion.choices[0].message.content?.replace(/`/g, '**');

    return NextResponse.json({ 
      result: formattedResponse,
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