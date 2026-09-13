"use client";

import { useState, useEffect } from 'react';

export default function ChangelogPage() {
  const [items, setItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (items.length >= 30 || loading) return;
    setLoading(true);
    setTimeout(() => {
      setItems(prev => {
        const nextItems = [];
        for (let i = 0; i < 5; i++) {
          if (prev.length + i < 30) {
            nextItems.push(prev.length + i + 1);
          }
        }
        return [...prev, ...nextItems];
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, loading]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Changelog</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item} className="p-6 border rounded shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">Update v1.0.{item}</h2>
            <p>Added new features and bug fixes.</p>
          </div>
        ))}
      </div>
      {loading && <p className="py-4 text-center">Loading more...</p>}
      {items.length >= 30 && <p className="py-4 text-center">No more updates.</p>}
    </main>
  );
}
