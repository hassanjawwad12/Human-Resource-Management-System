import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { colors } from './colors';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Professional = ({ data }) => {
  const techColors = {};
  let colorIndex = 0;

  data.forEach((period) => {
    period.technologies.forEach((tech) => {
      if (!techColors[tech]) {
        techColors[tech] = colors[colorIndex % colors.length];
        colorIndex++;
      }
    });
  });

  const periodLabels = data.map((period) => {
    const start = new Date(period.startDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    const end = new Date(period.endDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    return `${start} - ${end}`;
  });

  const chartData = {
    labels: periodLabels,
    datasets: Object.keys(techColors).map((tech) => ({
      label: tech,
      data: data.map((period) => (period.technologies.includes(tech) ? 1 : 0)),
      backgroundColor: techColors[tech],
      borderWidth: 1,
    })),
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Technologies Used',
          font: { size: 16, weight: 'bold' },
        },
        ticks: { display: false },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Time Periods',
          font: { size: 16, weight: 'bold' },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}`,
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="w-[85%] mt-6">
      <h2 className="text-center font-bold text-lg mb-4">Technologies Used Over Time</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Professional;
