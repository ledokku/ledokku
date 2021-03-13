import { useEffect } from 'react';
import { useHistory } from 'react-router';
import * as Fathom from 'fathom-client';
import { config } from '../config';

export const useTracking = () => {
  const siteId = 'BOXHWTSC';
  const { listen } = useHistory();

  useEffect(() => {
    if (!config.telemetryDisabled) {
      Fathom.load(siteId);
    }

    const unlisten = listen((location) => {
      // Only track on production
      if (config.environment !== 'production') {
        return;
      }

      Fathom.trackPageview({ url: location.pathname });
    });

    return unlisten;
  }, [listen]);
};
