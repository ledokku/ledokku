import React from 'react';
import { Page as PageComponent } from './components/Page';

import { BreadcrumbHeader } from './components/BreadcrumbHeader';

export class Page extends React.Component {
  public static BreadcrumbHeader = BreadcrumbHeader;

  render() {
    return <PageComponent {...this.props} />;
  }
}
