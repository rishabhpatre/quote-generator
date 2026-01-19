'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import RFQLayout from '@/components/RFQLayout';

const POPULAR_CATEGORIES = [
  { name: 'Coffee Shop', query: 'open a coffee shop' },
  { name: 'Clothing Store', query: 'start a clothing store' },
  { name: 'Gym Setup', query: 'set up a gym' },
  { name: 'Packaging', query: 'package fragile items' },
];

const EXAMPLE_QUERIES = [
  { text: 'I want to open a coffee shop in Mumbai' },
  { text: 'Need 100 ball bearings for manufacturing' },
  { text: 'How to package fragile items safely' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rfqData, setRfqData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setRfqData(null);

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setRfqData(data);
    } catch (error) {
      console.error("Failed to process RFQ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryQuery) => {
    setQuery(categoryQuery);
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">RFQ Agent</span>
          </div>
          <button className="header-btn">Sign In</button>
        </div>
      </header>

      {/* Hero Section */}
      {!rfqData && (
        <section className="hero">
          <div className="hero-inner">
            <h1 className="headline">
              Get quotes for anything.<br />
              <span className="headline-light">Powered by AI.</span>
            </h1>

            <form onSubmit={handleSubmit} className="search-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need? e.g. coffee shop equipment, 500 office chairs..."
                className="search-field"
              />
              <button type="submit" disabled={isLoading} className="search-btn">
                {isLoading ? 'Processing...' : 'Get Quotes →'}
              </button>
            </form>

            <div className="suggestions">
              {POPULAR_CATEGORIES.map((cat, index) => (
                <button
                  key={index}
                  className="suggestion"
                  onClick={() => handleCategoryClick(cat.query)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="examples">
              <span className="examples-label">Try:</span>
              {EXAMPLE_QUERIES.map((example, index) => (
                <button
                  key={index}
                  className="example-link"
                  onClick={() => handleExampleClick(example.text)}
                >
                  {example.text}
                </button>
              ))}
            </div>

            <p className="trust-line">
              Trusted by 5 Cr+ suppliers • ₹500 Cr+ in quotes generated
            </p>
          </div>
        </section>
      )}

      {/* Results Section */}
      {rfqData && (
        <div className="results-wrapper">
          <div className="results-header">
            <button onClick={() => setRfqData(null)} className="jd-btn jd-btn-outline">
              ← New Search
            </button>
            <div className="search-summary">
              <span className="query-text">Showing results for: "{query}"</span>
            </div>
          </div>
          <div className="results-content">
            <RFQLayout data={rfqData} />
          </div>
        </div>
      )}
    </div>
  );
}
