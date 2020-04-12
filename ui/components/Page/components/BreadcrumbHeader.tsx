import React from 'react';

import { styled } from '../../..';
import { DividerVertical } from '../../Divider/components/DividerVertical';

interface Item {
  label: string;
  href?: string;
}

export interface BreadcrumbHeaderProps {
  items: Item[];
}

export const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = (props) => {
  const { items } = props;
  return (
    <Root>
      <Breadcrumb>
        <LogoItem>
          <Link href="/">
            <LogoLabel>Ledokku</LogoLabel>
          </Link>
        </LogoItem>

        {items.map((item, index) => (
          <Item key={index}>
            <BreadcrumbDivider />

            <Link href={item.href}>
              <Label>{item.label}</Label>
            </Link>
          </Item>
        ))}
      </Breadcrumb>
    </Root>
  );
};

const Root = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  color: ${({ theme }) => theme.foreground};
  transition: ${({ theme }) => theme.transition};
`;

const Breadcrumb = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const BreadcrumbDivider = styled(DividerVertical)`
  height: 24px;
  margin: 0 16px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;

  @media ${({ theme }) => theme.media.phone} {
    display: none;
  }
`;

const LogoItem = styled(Item)`
  @media ${({ theme }) => theme.media.phone} {
    display: flex;
  }
`;

const Link = styled.a`
  margin: -4px -8px;
  padding: 4px 8px;
  text-decoration: none;
  color: currentColor;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.typography.label.fontFamily};
  font-size: 20px;

  @media ${({ theme }) => theme.media.tablet} {
    font-size: 16px;
  }

  @media ${({ theme }) => theme.media.phone} {
    font-size: 16px;
  }
`;

const LogoLabel = styled(Label)`
  font-weight: bold;
`;
