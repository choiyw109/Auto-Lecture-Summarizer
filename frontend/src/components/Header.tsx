
import React from 'react';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            W
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            WhisperSummarize
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Transform Media to Insights
        </div>
      </div>
    </header>
  );
};

export default Header;
