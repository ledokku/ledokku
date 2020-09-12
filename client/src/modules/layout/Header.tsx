import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from '@tailwindui/react';
import { useAuth } from '../auth/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h3 className="font-bold">
              <Link to="/">Ledokku</Link>
            </h3>
          </div>
          <div className="relative">
            <div>
              <button
                className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {user?.avatarUrl && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatarUrl}
                    alt="Avatar"
                  />
                )}
              </button>
            </div>
            <Transition
              show={isMenuOpen}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                <div
                  className="rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                  </div>
                  <div className="border-t border-gray-100" />
                  <div className="py-1">
                    <a
                      href="https://github.com/ledokku/ledokku"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Github
                    </a>
                  </div>
                  <div className="border-t border-gray-100" />
                  <div className="py-1">
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem"
                      onClick={() => logout()}
                    >
                      Logout
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </nav>
  );
};
