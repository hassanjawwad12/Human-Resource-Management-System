import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getBackgroundColor } from './helper';
Chart.register(...registerables);

const TaskPie = ({ data }) => {
    
  let ProjectAllocationData;
  if (data) {
    ProjectAllocationData = {
      labels: data.map((item) => item.activity),
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
        text: 'Hours Worked on each Task',
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-[45%]">
      {data && <Pie data={ProjectAllocationData} options={projectAllocationOptions} />}
    </div>
  );
};

export default TaskPie;
