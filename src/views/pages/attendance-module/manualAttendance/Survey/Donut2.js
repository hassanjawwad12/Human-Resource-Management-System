import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables);

const Donut2 = ({ labels, data, symbols }) => {
  const cumulativeSum = 100;

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data.map((value) => parseFloat(value.toFixed(2))),
        backgroundColor: ['#FF007A', '#F4A79D', '#344BFD', '#F68D2B'],
        borderWidth: 1,
        hoverOffset: [25, 10, 10, 10],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 16,
            family: 'Arial',
            weight: 'bold',
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed + ' ' + symbols;
            return label;
          },
        },
      },
      datalabels: {
        display: true,
        color: 'white',
        formatter: function (value, context) {
          return context.chart.data.labels[context.dataIndex];
        },
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    cutout: '50%',
  };

  const centerTextPlugin = {
    id: 'centerText',
    afterDatasetsDraw(chart) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;
      ctx.save();
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${cumulativeSum} ${symbols}`, width / 2, height / 2);
      ctx.restore();
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-[65%]">
        <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
};

export default Donut2;
