import React from 'react';

import { Flex as Component, FlexProps } from './components/Flex';
import { FlexItem } from './components/FlexItem';

export class Flex extends React.Component<FlexProps> {
  public static Item = FlexItem;

  render() {
    return <Component {...this.props} />;
  }
}
