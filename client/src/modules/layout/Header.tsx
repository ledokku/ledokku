import React, { useState } from 'react';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';
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
              <Link href="/" passHref>
                <a>Ledokku</a>
              </Link>
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

            <CSSTransition
              in={isMenuOpen}
              timeout={100}
              classNames={{
                enter:
                  'transition ease-out duration-100 transform opacity-0 scale-95',
                enterActive: 'transform opacity-100 scale-100',
                exit:
                  'transition ease-in duration-75 transform opacity-100 scale-100',
                exitActive: 'transform opacity-0 scale-95',
              }}
              unmountOnExit
            >
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                <div
                  className="rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1">
                    <Link href="/dashboard" passHref>
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Dashboard
                      </a>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100" />
                  <div className="py-1">
                    <a
                      href="https://github.com/ledokku/ledokku"
                      target="_blank"
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
            </CSSTransition>
          </div>
        </div>
      </div>
    </nav>
  );
};
