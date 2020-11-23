import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../auth/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

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
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid">
                    {user?.avatarUrl && (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatarUrl}
                        alt="Avatar"
                      />
                    )}
                  </Menu.Button>

                  <Transition
                    show={open}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg outline-none"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Dashboard
                          </Link>
                        </Menu.Item>
                      </div>
                      <div className="border-t border-gray-100" />
                      <div className="py-1">
                        <Menu.Item>
                          <a
                            href="https://github.com/ledokku/ledokku"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Github
                          </a>
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <div className="border-t border-gray-100" />
                        <Menu.Item>
                          <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            role="menuitem"
                            onClick={() => logout()}
                          >
                            Logout
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};
