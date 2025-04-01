import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type CSVData = {
  headers: string[];
  rows: string[][];
};

async function parseCSV(csvContent: string): Promise<CSVData> {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
  return { headers, rows };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const csvFile = formData.get('file') as File | null;

    let csvData: CSVData | null = null;
    if (csvFile) {
      const csvContent = await csvFile.text();
      csvData = await parseCSV(csvContent);
    }

    // Enhanced prompt to handle both scenarios
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that creates and enhances spreadsheets. 
          ${csvData ? 'Analyze the provided CSV data and suggest appropriate formulas and enhancements.' 
                   : 'Create a new spreadsheet structure based on the description.'}
          
          Return your response in this format:
          ---DESCRIPTION---
          [Your description of what the spreadsheet does or what changes are being made]
          ---STRUCTURE---
          {
            "headers": ["Column1", "Column2", ...],
            "formulas": [
              {"cell": "C1", "formula": "=A1+B1", "description": "Calculates..."}
            ],
            ${csvData ? '"modifications": ["List of changes to make"],' : ''}
            "dataTypes": {"Column1": "number", "Column2": "text", ...}
          }`
        },
        {
          role: "user",
          content: csvData 
            ? `Analyze this CSV data and ${prompt}:\n${JSON.stringify(csvData)}`
            : prompt
        }
      ],
    });

    const response = completion.choices[0].message.content || '';
    
    // Parse the response
    const [description, structureStr] = response.split('---STRUCTURE---');
    const cleanDescription = description.replace('---DESCRIPTION---', '').trim();
    
    let structure = { 
      headers: [], 
      formulas: [],
      modifications: [],
      dataTypes: {}
    };

    try {
      structure = JSON.parse(structureStr.trim());
    } catch (e) {
      console.error('Failed to parse structure:', e);
    }

    return NextResponse.json({ 
      result: cleanDescription,
      structure,
      originalData: csvData,
      success: true 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process spreadsheet',
      success: false 
    }, { status: 500 });
  }
}