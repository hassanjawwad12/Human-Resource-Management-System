import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getBackgroundColor } from './helper';
Chart.register(...registerables);

const Report2 = ({ data }) => {
 
  let ProjectAllocationData;
  if (data) {
    ProjectAllocationData = {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: 'Project Allocation',
          data: data.map((item) => item.hours),
          backgroundColor: data.map((_, index) => getBackgroundColor(index)),
        },
      ],
    };
  }

  const projectAllocationOptions = {
    responsive: true, 
    plugins: {
      title: {
        display: true,
        text: 'Project Allocation by Hours Worked',
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-full">
      {data && <Pie data={ProjectAllocationData} options={projectAllocationOptions} />}
    </div>
  );
};

export default Report2;
