import { useEffect } from 'react';
import { useHistory } from 'react-router';
import * as Fathom from 'fathom-client';
import { NODE_ENV, TELEMETRY_DISABLED } from '../constants';

export const useTracking = () => {
  const siteId = 'BOXHWTSC';
  const { listen } = useHistory();

  useEffect(() => {
    if (!TELEMETRY_DISABLED) {
      Fathom.load(siteId);
    }

    const unlisten = listen((location) => {
      // Only track on production
      if (NODE_ENV !== 'production') {
        return;
      }

      Fathom.trackPageview({ url: location.pathname });
    });

    return unlisten;
  }, [listen]);
};
