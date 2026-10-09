import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Assignment 2 — Power Electronics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Website for Assignment 2 by{' '}
          <span className="font-bold text-blue-700 bg-blue-50 px-1 rounded">
            Akhilesh Dixit (24EE10032)
          </span>
        </p>
      </div>
      <div className="text-right flex flex-col items-end">
        <p className="text-sm text-gray-600 mb-1">Developed by:</p>
        <div className="font-extrabold text-blue-800 bg-blue-100 px-3 py-1 rounded shadow-sm border border-blue-200">
          Akhilesh Dixit (24EE10032)
        </div>
      </div>
    </header>
  );
};

export default Header;
