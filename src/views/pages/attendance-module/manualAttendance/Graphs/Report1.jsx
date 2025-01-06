import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getBackgroundColor } from './helper';
Chart.register(...registerables);

const Report1 = ({ data }) => {
  let chartData;
  if (data) {
    chartData = {
      labels: data?.dates,
      datasets: data?.projects.map((project, index) => ({
        label: `Time Spent on ${project?.name}`,
        data: project?.hours,
        backgroundColor: getBackgroundColor(index),
      })),
    };
  }

  const chartOptions = {
    responsive: true, 
    scales: {
      y: {
        beginAtZero: true,
        max: 8,
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
        text: 'Time Spent',
      },
    },
  };

  return <>{chartData && <Bar data={chartData} options={chartOptions} />}</>;
};

export default Report1;
