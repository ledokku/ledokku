import { styled } from '../../../StyledComponents';
import { Box, BoxProps } from '../../Box';
import { Divider } from '../../Divider';
import { Typography } from '../../Typography';
import { rgba } from 'polished';

export interface LogBoxProps extends BoxProps {
  title: React.ReactNode | string;
}

export const LogBox: React.FC<LogBoxProps> = ({
  title,
  children,
  ...props
}) => (
  <Root>
    <Title>{title}</Title>
    <HorizontalDivider />
    <Logs>{children}</Logs>
  </Root>
);

const Root = styled(Box)`
  background: ${({ theme }) => theme.foreground};
  color: ${({ theme }) => theme.background};
  border-radius: 4px;
`;

const Title = styled(Typography.Label)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.background};
  padding: 16px 24px;
`;

const HorizontalDivider = styled(Divider.Horizontal)`
  background: ${({ theme }) => rgba(theme.background, 0.2)};
`;

const Logs = styled.pre`
  color: ${({ theme }) => theme.background};
  padding: 24px;
  overflow: auto;
  margin: 0;
`;
