import React from 'react';
import { rgba } from 'polished';

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
    <React.Fragment>
      <Root>
        <Breadcrumb>
          <Item>
            <Link href="/">
              <LogoLabel>Ledokku</LogoLabel>
            </Link>
          </Item>

          {items.map((item, index) => (
            <Item key={index}>
              <DividerVertical />

              <Link href={item.href}>
                <Label>{item.label}</Label>
              </Link>
            </Item>
          ))}
        </Breadcrumb>
      </Root>

      {/* Visual placeholder for the height of the Root */}
      <RootMirror />
    </React.Fragment>
  );
};

const Root = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-content: center;
  color: ${({ theme }) => theme.foreground};
  transition: ${({ theme }) => theme.transition};

  @media ${({ theme }) => theme.media.phone} {
    position: relative;
    justify-content: flex-start;
  }
`;

const RootMirror = styled.div`
  /* min-height: 56px; */

  @media ${({ theme }) => theme.media.phone} {
    display: none;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  @media ${({ theme }) => theme.media.phone} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BreadcrumbDivider = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${({ theme }) => theme.divider.width}px;
  width: 100%;
  background: ${({ theme }) => rgba(theme.foreground, theme.divider.opacity)};
`;

const Item = styled.div`
  display: flex;
  align-items: center;

  @media ${({ theme }) => theme.media.phone} {
    margin-top: 8px;

    &:first-of-type {
      margin-top: 0;
    }
  }

  svg {
    margin-right: 8px;
  }
`;

const Chevron = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  margin: 1px 8px 0;

  @media ${({ theme }) => theme.media.phone} {
    margin: 4px 8px 0 12px;
    align-self: flex-start;
  }

  svg {
    width: 24px;
    height: 24px;
    margin: 0;
    zoom: 0.5;

    @media ${({ theme }) => theme.media.phone} {
      transform: rotateZ(135deg);
    }
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
`;

const LogoLabel = styled(Label)`
  font-weight: bold;
`;
