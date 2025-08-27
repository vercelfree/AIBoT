import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Search, BookOpen, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WordList = () => {
  const [savedWords, setSavedWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedWords();
  }, []);

  useEffect(() => {
    // Filter words based on search term
    const filtered = savedWords.filter(word =>
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.bangla.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWords(filtered);
  }, [savedWords, searchTerm]);

  const loadSavedWords = () => {
    try {
      const words = JSON.parse(localStorage.getItem('savedWords') || '[]');
      setSavedWords(words);
    } catch (error) {
      console.error('Error loading saved words:', error);
      setSavedWords([]);
    }
  };

  const deleteWord = (wordId) => {
    try {
      const updatedWords = savedWords.filter(word => word.id !== wordId);
      setSavedWords(updatedWords);
      localStorage.setItem('savedWords', JSON.stringify(updatedWords));
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const clearAllWords = () => {
    if (window.confirm('Are you sure you want to delete all saved words?')) {
      setSavedWords([]);
      localStorage.removeItem('savedWords');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    My Word List
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {savedWords.length} word{savedWords.length !== 1 ? 's' : ''} saved
                  </p>
                </div>
              </div>
            </div>

            {savedWords.length > 0 && (
              <button
                onClick={clearAllWords}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {savedWords.length > 0 ? (
          <>
            {/* Search Bar */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search words in English or Bangla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Word List */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                {searchTerm ? `Search Results (${filteredWords.length})` : 'All Words'}
              </h2>

              {filteredWords.length === 0 && searchTerm ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No words found matching "{searchTerm}"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWords.map((word) => (
                    <div
                      key={word.id}
                      className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-5 border border-emerald-100 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {word.english}
                              </h3>
                              <p className="text-emerald-700 font-medium text-lg">
                                {word.bangla}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Added on {formatDate(word.addedAt)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteWord(word.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                          title="Delete word"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No Words Saved Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start translating text and save individual words to build your personal vocabulary list.
            </p>
            <button
              onClick={goBack}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Translating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordList;