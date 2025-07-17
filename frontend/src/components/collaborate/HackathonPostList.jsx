import React from 'react';
import HackathonPostCard from './HackathonPostCard';

export default function HackathonPostList({ posts, currentUser, onEdit, onDelete, showOwnerActions }) {
  return (
    <div className="w-full mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {posts.map((post, idx) => (
          <HackathonPostCard key={idx} post={post} currentUser={currentUser} onEdit={onEdit} onDelete={onDelete} showOwnerActions={showOwnerActions} />
        ))}
      </div>
    </div>
  );
} 