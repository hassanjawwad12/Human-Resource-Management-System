import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getBackgroundColor } from './helper';
Chart.register(...registerables);

const Report4 = ({ data }) => {
  
  let radarData;
  if (data) {
    radarData = {
      labels: data.labels, 
      datasets: data.datasets.map((dataset, index) => ({
        label: dataset.projectName,
        data: dataset.hoursWorked, 
        backgroundColor: getBackgroundColor(index), 
      })),
    };
  }

  const radarOptions = {
    responsive: true, 
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Employee Task Distribution Across Projects',
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-full ">
      {radarData && <Radar data={radarData} options={radarOptions} />}
    </div>
  );
};

export default Report4;
