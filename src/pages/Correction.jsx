import React, { useState } from 'react';
import { Send, Languages, BookOpen, Loader2, Copy, Check, Plus, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Correction = () => {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [wordMeanings, setWordMeanings] = useState([]);
  const [corrections, setCorrections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedWords, setAddedWords] = useState(new Set());
  const navigate = useNavigate();

  const translateText = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
      }

      const prompt = `
        First, check if the following English text has any grammatical errors, spelling mistakes, or structural issues. Then translate it to Bangla and provide word-by-word meanings.
        
        Text: "${inputText}"
        
        Please respond in this exact JSON format:
        {
          "hasErrors": true/false,
          "corrections": [
            {
              "original": "wrong word or phrase",
              "corrected": "correct word or phrase",
              "type": "grammar/spelling/structure",
              "explanation": "brief explanation of the mistake"
            }
          ],
          "correctedSentence": "full corrected sentence here (only if hasErrors is true)",
          "translation": "full bangla translation of the corrected sentence",
          "wordMeanings": [
            {
              "english": "word1",
              "bangla": "bangla meaning"
            },
            {
              "english": "word2", 
              "bangla": "bangla meaning"
            }
          ]
        }
        
        If there are no errors, set hasErrors to false and corrections to empty array. Use the original sentence for translation.
        Make sure to include all meaningful words in wordMeanings (exclude articles like 'a', 'an', 'the' unless contextually important).
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setCorrections(result.hasErrors ? result : null);
        setTranslation(result.translation);
        setWordMeanings(result.wordMeanings || []);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('Translation failed. Please check your API key and try again.');
      setWordMeanings([]);
      setCorrections(null);
    }
    
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (translation) {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addWordToList = (word) => {
    try {
      // Get existing words from localStorage
      const existingWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
      
      // Check if word already exists
      const wordExists = existingWords.some(
        savedWord => savedWord.english.toLowerCase() === word.english.toLowerCase()
      );

      if (!wordExists) {
        const newWord = {
          id: Date.now(),
          english: word.english,
          bangla: word.bangla,
          addedAt: new Date().toISOString()
        };

        const updatedWords = [...existingWords, newWord];
        localStorage.setItem('savedWords', JSON.stringify(updatedWords));
        
        // Update local state to show word is added
        setAddedWords(prev => new Set([...prev, word.english.toLowerCase()]));
        
        // Show success feedback (optional)
        console.log('Word added successfully!');
      }
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      translateText();
    }
  };

  const goToWordList = () => {
    navigate('/wordlist');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-xl">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  English Sentence Corrector
                </h1>
                <p className="text-gray-600 text-sm">Powered by Black AI</p>
              </div>
            </div>
            
            <button
              onClick={goToWordList}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <List className="w-5 h-5" />
              My Words
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800">Enter English Text</h2>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your English sentence here..."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm"
            />
            
            <button
              onClick={translateText}
              disabled={!inputText.trim() || loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Make Correct Sentence
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {(corrections || translation || wordMeanings.length > 0) && (
          <div className="space-y-6">
            {/* Grammar Corrections */}
            {corrections && corrections.hasErrors && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Grammar Corrections Found</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Original vs Corrected */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-red-700 mb-2">Original (with errors):</h4>
                      <p className="text-red-600 font-medium">{inputText}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-green-700 mb-2">Corrected:</h4>
                      <p className="text-green-600 font-medium">{corrections.correctedSentence}</p>
                    </div>
                  </div>
                  
                  {/* Detailed Corrections */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Corrections Made:</h4>
                    {corrections.corrections?.map((correction, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                            {correction.original}
                          </span>
                          <span className="text-gray-500">→</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                            {correction.corrected}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                            {correction.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{correction.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Translation Result */}
            {translation && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Bangla Translation
                    {corrections && corrections.hasErrors && (
                      <span className="text-sm text-green-600 ml-2">(of corrected sentence)</span>
                    )}
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border-l-4 border-emerald-400">
                  <p className="text-xl text-gray-800 font-medium leading-relaxed">
                    {translation}
                  </p>
                </div>
              </div>
            )}

            {/* Word Meanings */}
            {wordMeanings.length > 0 && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Word by Word Meanings</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {wordMeanings.map((word, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-shadow relative">
                      <div className="text-sm font-semibold text-gray-700 mb-1">
                        {word.english}
                      </div>
                      <div className="text-purple-700 font-medium mb-3">
                        {word.bangla}
                      </div>
                      
                      <button
                        onClick={() => addWordToList(word)}
                        disabled={addedWords.has(word.english.toLowerCase())}
                        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 ${
                          addedWords.has(word.english.toLowerCase())
                            ? 'bg-green-100 text-green-600 cursor-not-allowed'
                            : 'bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 shadow-md hover:shadow-lg'
                        }`}
                        title={addedWords.has(word.english.toLowerCase()) ? 'Word already added' : 'Add to word list'}
                      >
                        {addedWords.has(word.english.toLowerCase()) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Correction;