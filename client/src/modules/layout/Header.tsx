import { Link } from 'react-router-dom';
import {
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Heading,
  Box,
} from '@chakra-ui/react';
import { useAuth } from '../auth/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Container maxW="5xl">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          h={16}
        >
          <Box display="flex" alignItems="center">
            <Heading as="h3" fontSize="medium">
              <Link to="/">Ledokku</Link>
            </Heading>
          </Box>
          <div>
            <Menu placement="bottom-end">
              <MenuButton>
                {user?.avatarUrl && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatarUrl}
                    alt="Avatar"
                  />
                )}
              </MenuButton>
              <MenuList fontSize="sm" color="gray.700">
                <MenuItem as={Link} to="/dashboard">
                  Dashboard
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  as="a"
                  href="https://github.com/ledokku/ledokku"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => logout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>
      </Container>
    </nav>
  );
};
