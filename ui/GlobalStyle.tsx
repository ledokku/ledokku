import { createGlobalStyle } from './StyledComponents';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.background};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;

    background: radial-gradient(rgba(0, 0, 0, 0.1) 1.25px, #FFF 1.25px);
    background-size: 18px 18px;
  }

  #__next {
    height: 100%;
  }
`;
