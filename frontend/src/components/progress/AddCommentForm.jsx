import React from 'react';

function AddCommentForm({ onAdd }) {
  const [text, setText] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div className="relative mb-6">
      <form
        onSubmit={e => {
          e.preventDefault();
          if (text.trim()) {
            onAdd(text);
            setText('');
            setIsFocused(false);
          }
        }}
        className="group"
      >
        <div className="relative">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !text && setIsFocused(false)}
            className={`w-full resize-none border-2 rounded-2xl px-5 py-4 text-gray-800 placeholder-gray-400 
              transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg
              ${isFocused || text ? 'border-violet-500 bg-white' : 'border-gray-200 bg-gray-50/50'}
              focus:outline-none focus:ring-0 focus:border-violet-500
              ${text ? 'min-h-[120px]' : 'min-h-[60px]'}`}
            placeholder="Share your thoughts..."
            rows={text ? 3 : 1}
          />
          {(isFocused || text) && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 opacity-20 -z-10 blur-sm animate-pulse" />
          )}
        </div>
        <div className={`flex justify-between items-center mt-4 transition-all duration-300 ${
          isFocused || text ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="text-sm text-gray-500">{text.length}/280 characters</div>
          <div className="flex gap-3">
            {(isFocused || text) && (
              <button
                type="button"
                onClick={() => {
                  setText('');
                  setIsFocused(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!text.trim()}
              className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 
                transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
                ${text.trim() 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 cursor-pointer' 
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              <span className="flex items-center gap-2">
                Post Comment
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddCommentForm; 