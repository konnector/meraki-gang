import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ 
        error: 'Invalid prompt provided',
        success: false 
      }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that enhances spreadsheet generation prompts. Your goal is to make prompts more specific, detailed, and actionable.

When enhancing prompts:
1. Add specific details about data organization and structure
2. Include relevant calculations or formulas that might be needed
3. Specify formatting preferences where applicable
4. Add data validation requirements if relevant
5. Maintain the original intent while making it more comprehensive

Example:
Original: "Create a budget tracker"
Enhanced: "Create a monthly budget tracker with income categories (salary, investments, other), expense categories (housing, utilities, groceries, transportation), automatic calculation of total income, total expenses, and remaining balance. Include a savings goal tracker and percentage-based spending analysis."

Keep the enhanced prompt concise but comprehensive. Do not add unnecessary complexity.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const enhancedPrompt = completion.choices[0].message.content || '';

    return NextResponse.json({ 
      result: enhancedPrompt,
      success: true 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Failed to enhance prompt',
      success: false 
    }, { status: 500 });
  }
} 