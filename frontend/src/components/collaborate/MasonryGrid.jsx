import React from 'react';

export default function MasonryGrid({ children }) {
  // Each child (card) should have 'break-inside-avoid' and can have animation classes for fade-in
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {React.Children.map(children, (child, i) => (
        <div className="break-inside-avoid animate-fadeIn" style={{ animationDelay: `${i * 60}ms` }}>
          {/* Optionally add more animation classes here for each card */}
          {child}
        </div>
      ))}
    </div>
  );
} 