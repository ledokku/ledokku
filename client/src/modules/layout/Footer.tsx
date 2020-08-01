import React from 'react';
import { Twitter, GitHub } from 'react-feather';

export const Footer = () => {
  return (
    <footer className="bg-gray-200">
      <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-wrap flex-col sm:flex-row">
        <p className="text-gray-500 text-sm text-center sm:text-left">
          © {new Date().getFullYear()} ledokku
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <a
            className="text-gray-400"
            href="https://twitter.com/ledokku"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            className="ml-3 text-gray-400"
            href="https://github.com/ledokku/ledokku"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub className="w-5 h-5" />
          </a>
        </span>
      </div>
    </footer>
  );
};
