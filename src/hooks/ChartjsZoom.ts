import { useEffect } from 'react';
import * as zoom from 'chartjs-plugin-zoom';
import Hammer from 'hammerjs';

function eslintWarningHandler(arg:any) {
    return
}

// Hook to assist with zooming
export function useChartjsZoom(): object {
    eslintWarningHandler(Hammer)

    const basic: object = {
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          enabled: true,
          mode: 'xy',
        }
    }
  
    useEffect(() => {
        const Chart = require('react-chartjs-2').Chart;
        Chart.pluginService.register(zoom);
      }, [ ])

    return basic;
}