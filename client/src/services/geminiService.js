import { GoogleGenerativeAI } from '@google/generative-ai';
import { nceacQA, generateFullContext, getSystemPrompt } from '../data/nceacData.js';

// Initialize the Gemini API with your API key
const API_KEY = 'AIzaSyAj47t8s1gelyqqUrcHzQTZ-7M2Y_-O-nI';
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to find direct matches in our NCEAC QA dataset
const findDirectMatch = (query) => {
  // Normalize query for comparison
  const normalizedQuery = query.toLowerCase().trim();
  
  // Try to find an exact match first
  const exactMatch = nceacQA.find(qa => 
    qa.question.toLowerCase() === normalizedQuery
  );
  
  if (exactMatch) return exactMatch.answer;
  
  // Try to find a partial match (if query contains the question)
  const partialMatches = nceacQA.filter(qa => 
    normalizedQuery.includes(qa.question.toLowerCase()) || 
    qa.question.toLowerCase().includes(normalizedQuery)
  );
  
  // Return the most relevant partial match if available
  if (partialMatches.length > 0) {
    // Sort by length - shorter matches are likely more specific
    const bestMatch = partialMatches.sort((a, b) => 
      Math.abs(a.question.length - normalizedQuery.length) - 
      Math.abs(b.question.length - normalizedQuery.length)
    )[0];
    
    return bestMatch.answer;
  }
  
  return null;
};

// Process user query and get response using Gemini
export const processQuery = async (query) => {
  try {
    // First, check for direct matches in our dataset
    const directMatch = findDirectMatch(query);
    if (directMatch) {
      return {
        text: directMatch,
        source: 'local'
      };
    }
    
    // If no direct match, use Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Generate chat context using our QA data
    const context = generateFullContext();
    const systemPrompt = getSystemPrompt();
    
    // Build chat history with context and query
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "I'll be asking questions about NCEAC. Here's some context information: " + context }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm ready to answer your questions about NCEAC based on the information you've provided." }],
        },
        {
          role: "user", 
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I'll focus solely on NCEAC-related topics. I'll provide concise, accurate information based on what you've shared." }],
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 200,
      },
    });

    // Send the user's query
    const result = await chat.sendMessage(query);
    const response = result.response;
    const responseText = response.text();
    
    return {
      text: responseText,
      source: 'gemini'
    };
  } catch (error) {
    console.error('Error processing query:', error);
    return {
      text: "I'm having trouble connecting to my knowledge base. Please try again later.",
      source: 'error'
    };
  }
};