import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Typography, Button } from '@mui/material';
import { padding } from '@mui/system';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graphs = ({ title, data }) => {
  const [showAllData, setShowAllData] = useState(false);
  
  const colors = [
    '#f4978e',
    '#fbc4ab',
    '#f6bc66',
    '#a7bed3',
    '#dab894',
    '#caffbf',
    '#cdb4db',
    '#efcfe3',
    '#e69597',
    '#ffb3c6',
    '#52b2cf',
  ];

  const filteredData = data.filter((lang) => parseInt(lang.Experience, 10) > 0);
  const displayData = showAllData ? data : filteredData;

  const graphData = {
    labels: displayData.map((lang) => lang.Name),
    datasets: [
      {
        label: 'Experience (years)',
        data: displayData.map((lang) => parseInt(lang.Experience, 10)),
        backgroundColor: colors.slice(0, displayData.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 7,
        title: {
          display: true,
          text: 'Experience (years)',
          font: {
            size: 16, 
            weight: 'bold',
            padding:2,
          },
        },
       
      },
      x: {
        title: {
          display: true,
          text: 'Programming Languages',
          font: {
            size: 16, 
            weight: 'bold',
            padding:2,
          },
        },
      },
    },
   
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex;
            const currentItem = displayData[dataIndex];
            
            let label = `Experience: ${context.formattedValue} years`;
            
            if (currentItem.startDate && currentItem.endDate) {
              label += `\nStart Date: ${currentItem.startDate}`;
              label += `\nEnd Date: ${currentItem.endDate}`;
            }
            
            return label;
          },
          title: function(context) {
            return context[0].label;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col w-[50%] items-center px-4">
      <div className='pl-4 flex items-center justify-between w-full py-1'>
      <Typography variant="h5">{title}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowAllData(!showAllData)}
          className=' text-[10px] p-1'
        >
          {showAllData ? 'Show Experienced' : 'Show All'}
        </Button>
      </div>
      <Bar data={graphData} options={options} />   
    </div>
  );
};

export default Graphs;