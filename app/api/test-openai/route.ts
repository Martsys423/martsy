import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    // Check if OpenAI API key is set with either name
    const apiKey = process.env.NEXT_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: "Neither NEXT_OPENAI_API_KEY nor OPENAI_API_KEY is set in environment variables"
      }, { status: 500 });
    }
    
    // Make a simple test call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Say hello"
          }
        ],
        max_tokens: 10
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: "OpenAI API error",
        error: result.error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: "OpenAI API is working",
      response: result
    });
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
    return NextResponse.json({
      success: false,
      message: "Error testing OpenAI API",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 