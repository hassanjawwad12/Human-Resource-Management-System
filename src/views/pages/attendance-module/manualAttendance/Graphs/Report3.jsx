import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getBackgroundColor } from './helper';
Chart.register(...registerables);

const Report3 = ({ data }) => {

  let StackedData;

  if (data) {
    StackedData = {
      labels: data.dates,
      datasets: data.datasets.map((item, index) => ({
        label: `${item.project} - ${item.activity}`,
        data: item.data,
        backgroundColor: getBackgroundColor(index),
        stack: item.project,
      })),
    };
  }

  const StackchartOptions = {
    responsive: true, 
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Task Breakdown by Project and Day',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} hours`;
          },
        },
      },
    },
  };

  return <>{StackedData && <Bar data={StackedData} options={StackchartOptions} />}</>;

};

export default Report3;
