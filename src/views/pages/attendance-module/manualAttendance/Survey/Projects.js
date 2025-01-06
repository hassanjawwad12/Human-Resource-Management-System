import { Typography } from '@mui/material';
import React from 'react';
import Divider from '@mui/material/Divider';

const Projects = ({ project }) => {
  return (
    <div className="flex flex-wrap w-[84%] justify-center items-center gap-3 px-1">
      {project?.map((project, index) => (
        <div
          key={index}
          className="flex flex-col items-center py-2 w-[24%] h-[350px]  border border-[#A9A1E1] rounded-md"
        >
          <div className="w-full flex flex-col items-start gap-2 justify-start px-2">
            <div className='w-full items-center justify-center flex mt-2'>
            <Typography variant="h3" className='underline'>{project.name} </Typography>
            </div>
            <Typography variant="h5">
              Type: {project.type}
            </Typography>
            <Typography variant="h5">Contribution: {project.contribution} </Typography>

            <Typography variant="h6">
              ({project.startDate}) - ( {project.endDate ? project.endDate : 'Currently Working'})
            </Typography>
            <Divider flexItem className='mt-2' />
            <Typography variant="h4" className='text-blue-500 font-extrabold'>
              Technologies used:
            </Typography>
          </div>
                  
          <div className="flex flex-col items-start w-full py-2 gap-2 px-3 overflow-y-auto mt-1">
            {project.technology.map((tech, idx) => (
              <div key={idx} className="tech-icon flex gap-3 items-center w-full">
                <img
                  src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${tech.imageUrl}`}
                  className="w-6 h-auto tech-svg"
                />
                <p className="text-[16px] font-semibold">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;