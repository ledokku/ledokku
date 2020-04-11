import * as styledComponentsModule from 'styled-components';
import styledInterface, {
  ThemedStyledComponentsModule,
  ThemedStyledInterface,
} from 'styled-components';

import { Theme } from './themes/DefaultTheme';

const styledComponents = styledComponentsModule as ThemedStyledComponentsModule<
  Theme
>;

const styled = styledInterface as ThemedStyledInterface<Theme>;

const { createGlobalStyle } = styledComponents;

export { styled, styledComponents, createGlobalStyle };
