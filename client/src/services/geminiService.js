import { GoogleGenerativeAI } from '@google/generative-ai';
import { nceacQA, generateFullContext, getSystemPrompt } from '../data/nceacData.js';

// Initialize the Gemini API with your API key
const API_KEY = 'AIzaSyCJzEM2Cay0FqzHfNVawjof6ZmK3PgpvYE';
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to calculate string similarity using Levenshtein distance
const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  return track[str2.length][str1.length];
};

// Calculate similarity score between two strings
const calculateSimilarity = (str1, str2) => {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;
  return (maxLength - levenshteinDistance(str1, str2)) / maxLength;
};

// Extract keywords from text
const extractKeywords = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
};

// Calculate keyword overlap between two texts
const calculateKeywordOverlap = (text1, text2) => {
  const keywords1 = new Set(extractKeywords(text1));
  const keywords2 = new Set(extractKeywords(text2));
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  return intersection.size / union.size;
};

// Enhanced matching function that combines multiple techniques
const findBestMatch = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Try exact match first
  const exactMatch = nceacQA.find(qa => 
    qa.question.toLowerCase() === normalizedQuery
  );
  if (exactMatch) return exactMatch.answer;
  
  // Calculate scores for each QA pair
  const scores = nceacQA.map(qa => {
    const stringSimilarity = calculateSimilarity(normalizedQuery, qa.question.toLowerCase());
    const keywordScore = calculateKeywordOverlap(normalizedQuery, qa.question);
    
    // Combine scores with weights
    const combinedScore = (stringSimilarity * 0.6) + (keywordScore * 0.4);
    
    return {
      answer: qa.answer,
      score: combinedScore
    };
  });
  
  // Sort by score and get the best match
  const bestMatch = scores.sort((a, b) => b.score - a.score)[0];
  
  // Return if the match is good enough (threshold: 0.6)
  if (bestMatch.score >= 0.6) {
    return bestMatch.answer;
  }
  
  return null;
};

// Process user query and get response using Gemini
export const processQuery = async (query) => {
  try {
    // First, try enhanced pattern matching
    const bestMatch = findBestMatch(query);
    if (bestMatch) {
      return {
        text: bestMatch,
        source: 'local'
      };
    }
    
    // If no good match found, use Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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