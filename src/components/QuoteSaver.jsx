import { useState, useEffect } from "react";

export default function QuoteSaver() {
  const [saved, setSaved] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedQuotes") || "[]");
    setSaved(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("savedQuotes", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch("https://type.fit/api/quotes");
        const all = await res.json();
        const randomQuotes = all
          .filter((q) => q.text && q.author)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4); 
        setQuotes(randomQuotes);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load quotes", err);
        setLoading(false);
      }
    }
    fetchQuotes();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    const quote = quotes.find((q) => q.text === text);
    if (quote && !saved.find((q) => q.text === quote.text)) {
      setSaved([...saved, quote]);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row justify-center items-start">
      <div className="space-y-4 max-w-md">
        <h2 className="text-xl font-bold">Available Quotes</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          quotes.map((quote, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", quote.text)}
              className="p-4 border rounded cursor-grab bg-white dark:bg-gray-800 dark:text-white"
            >
              <p>“{quote.text}”</p>
              <p className="text-sm text-gray-500">— {quote.author}</p>
            </div>
          ))
        )}
      </div>

      <div
        className="min-w-[300px] min-h-[200px] p-6 border-2 border-dashed border-gray-400 rounded bg-gray-50 dark:bg-gray-900 dark:text-white"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2 className="text-xl font-bold mb-2"> Saved Quotes</h2>
        {saved.length === 0 && <p className="text-gray-500">Drop quotes here</p>}
        {saved.map((quote, i) => (
          <div key={i} className="p-3 border-b border-gray-300">
            <p>“{quote.text}”</p>
            <p className="text-sm text-gray-500">— {quote.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
