import Highcharts from "highcharts";

export const getDefaultOptions = (): Highcharts.Options => {
  return {
    title: {
      text: undefined,
    },
    xAxis: [
      {
        type: "datetime",
        gridLineWidth: 1,
        tickInterval: 24 * 3600 * 1000,
        // get current tme and subtract 1 week
        min: new Date().getTime() - 604800000,

        // get current time and add 1 day
        max: new Date().getTime() + 86400000,
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        // Sort the points
        const points: any = this.points;
        (points || []).sort(function (a: any, b: any) {
          return b && a && b.y! - a.y!;
        });

        // format x

        // Generate the tooltip text
        let tooltipText = "<b>" + this.x + "</b><br/>";
        (points || []).forEach(function (point: any) {
          tooltipText += point.series.name + ": " + point.y + "<br/>";
        });

        return tooltipText;
      },
    },
    yAxis: {
      title: {
        text: "Exchange rate",
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "area",
        name: "USD to EUR",
        data: [],
      },
    ],
  };
};
