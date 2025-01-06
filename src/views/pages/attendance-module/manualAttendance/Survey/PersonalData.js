import { Typography, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import './styles.css';
import { FaUniversity, FaGraduationCap } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import Graphs from './Graphs';
import Donut from './Donut';
import Donut2 from './Donut2';
import Projects from './Projects';
import PersonalAccordian from './PersonalAccordian';
import img1 from 'src/assets/stack/facebook.svg';
import img2 from 'src/assets/stack/linkedin.svg';
import img3 from 'src/assets/stack/person.png';
import Professional from './Professional';

const PersonalData = ({ data, newdata, image, designation, email,data3 }) => {
  const [expanded, setExpanded] = useState(false);
  const [data2, setdata2] = useState([]);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    setdata2(newdata?.Expertise);
    setProjectData(newdata?.Projects);
  }, [newdata]);

  const key1 = data2?.['Java and Related Technologies'];
  const key2 = data2?.['JavaScript Ecosystem'];
  const key3 = data2?.['Python and Related Frameworks'];
  const key4 = data2?.['Mobile Development (Non-JavaScript)'];
  const key5 = data2?.['Backend Development & Web Frameworks'];
  const key6 = data2?.['Frontend & UI Development'];
  const key7 = data2?.['Database Technologies'];
  const key8 = data2?.['Cloud Services & Serverless'];
  const key9 = data2?.['DevOps & CI/CD Tools'];
  const key10 = data2?.['Version Control & Collaboration Tools'];
  const key11 = data2?.['Content Management & E-commerce Platforms'];
  const key12 = data2?.['ERP, CRM & Automation Tools'];
  const key13 = data2?.['Data Visualization & Business Intelligence'];
  const key14 = data2?.['Testing & QA Tools'];
  const key15 = data2?.['APIs, Authentication & Security'];
  const key16 = data2?.['AI, ML, and Data Science'];
  const key17 = data2?.['Web Sockets & Real-Time Communication'];
  const key18 = data2?.['Mobile App Deployment & ASO'];
  const key19 = data2?.['Search Engine Optimization & Marketing'];
  const key20 = data2?.['Maps & Geolocation'];
  const key21 = data2?.['Blockchain & Web3 Technologies'];
  const key22 = data2?.['Integration & Automation Tools'];
  const key23 = data2?.['Programming Languages & Miscellaneous Tools'];
  const key24 = data2?.['Data Handling & Miscellaneous'];

  const handleClick = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
  };

  const categoryPieChart = newdata?.categoryPieChart || {};
  const programmingAreasLabels = Object.keys(categoryPieChart);
  const programmingAreasData = Object.values(categoryPieChart);

  const experienceLabels = ['Exergy', 'Others'];
  const experienceData = [data.experience_in_exergy_systems, data.other_experience];

  return (
    <>
      <div className="flex flex-col items-center w-full h-full p-2 gap-4 ">
        {/*Header Row */}
        <div className="flex flex-row w-[88%] items-center justify-between mt-4 ">
          <div className="flex flex-row gap-4">
            <div
              className={`w-40 h-44 py-2 rounded-md ${!image ? 'bg-gray-200' : 'bg-transparent'}`}
            >
              {image ? (
                <img
                  src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${image}`}
                  className="rounded-md"
                />
              ) : (
                <img src={img3} className="rounded-md" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-1">
                <Typography variant="h4" fontWeight={600}>
                  {data?.full_name}
                </Typography>
                <img
                  src={img1}
                  className="w-12 h-auto cursor-pointer"
                  onClick={() => window.open(newdata?.facebookUrl, '_blank')}
                  alt="Facebook"
                />
                <img
                  src={img2}
                  onClick={() => window.open(newdata?.linkedinUrl, '_blank')}
                  className="w-6 h-auto cursor-pointer"
                  alt="linkedin"
                />
              </div>
              <Typography variant="h6" className="text-[#626262] font-semibold">
                {designation}
              </Typography>

              <div className="flex flex-row gap-3 items-center mt-4">
                <div className="rounded-full bg-[#D9E6FE] text-[#4E7CFE] w-10 h-10 flex items-center justify-center">
                  <FaEnvelope className="text-xl" />
                </div>
                <Typography variant="h6">{email}</Typography>
              </div>

              <div className="flex flex-row gap-3 items-center mt-4">
                <div className="rounded-full bg-[#FDEBD3] text-[#FF9B3E] w-10 h-10 flex items-center justify-center">
                  <FaLocationDot className="text-xl" />
                </div>
                <Typography variant="h6">{data?.current_address}</Typography>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-[30%] items-start mb-2">
            <div className="p-2 rounded-md bg-[#2732731A] text-black font-bold text-lg w-full">
              Education
            </div>

            <div className="flex flex-row gap-3 items-center mt-3">
              <div className="rounded-full bg-[#FFE3E2] text-[#FE4C48] w-10 h-10 flex items-center justify-center">
                <FaGraduationCap className="text-xl" />
              </div>
              <Typography variant="h6">{data?.last_educational_degree}</Typography>
            </div>

            {data?.university ? (
              <div className="flex flex-row gap-3 items-center mt-4">
                <div className="rounded-full bg-green-200 text-[#2EC32E] w-10 h-10 flex items-center justify-center">
                  <FaUniversity className="text-xl" />
                </div>
                <Typography variant="h6">{data?.university}</Typography>
              </div>
            ) : null}
          </div>
        </div>

        {/*Personla Data Accordian */}
        <div className="flex flex-col w-full items-center justify-center mt-6 pt-4 gap-2">
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            className={`px-4 cursor-pointer py-[0.5px] w-[88%] rounded-md bg-[#2732731A] ${
              expanded ? 'border-b ' : ''
            }`}
            onClick={handleClick}
          >
            <Typography variant="h4" className="mt-2 text-blue-500 font-semibold">
              Personal Data
            </Typography>

            <div className="flex gap-2">
              <IconButton onClick={handleClick}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
          </Stack>

          <Collapse in={expanded} timeout="auto" unmountOnExit className="w-[78%]">
            <PersonalAccordian data={data} />
          </Collapse>

          {/*Professioanl Experience Banner*/}
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            className="px-4 py-1 w-[88%] rounded-md bg-[#2732731A] mt-6"
          >
            <Typography variant="h4" className="mt-2 py-1 text-blue-500 font-semibold">
              Professional Experience
            </Typography>
          </Stack>
        </div>

        {/*Donut Charts */}
        <div className="flex flex-row items-center gap-1 w-[88%] justify-between">
          <div className="w-full border border-[#A9A1E1] border-opacity-40 rounded-md ">
            <div className=" py-1 px-3 text-blue-500 text-lg font-bold rounded-md bg-[#2732731A]">
              Programming Areas
            </div>
            <Donut2 labels={programmingAreasLabels} data={programmingAreasData} symbols={'%'} />
          </div>

          <div className="w-full border border-[#A9A1E1] border-opacity-40 rounded-md ">
            <div className=" py-1 px-3 text-blue-500 text-lg font-bold rounded-md bg-[#2732731A]">
              Experience Distribution
            </div>
            <Donut labels={experienceLabels} data={experienceData} symbols={'years'} />
          </div>
        </div>

        <Professional data={data3}/>

        {/*Projects stack wise */}
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          className="px-4 py-2 w-[88%] rounded-md bg-[#2732731A] "
        >
          <Typography variant="h4" className="mt-2 text-blue-500 font-semibold">
            My Projects
          </Typography>
        </Stack>

        <Projects project={projectData} />

        {/*Bar Charts */}
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          className="px-4 py-2 w-[88%] rounded-md bg-[#2732731A] "
        >
          <Typography variant="h4" className="mt-2 text-blue-500 font-semibold">
            Overall Experience
          </Typography>
        </Stack>

        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key1 && <Graphs data={key1} title={'Experience in Java and Related Technologies'} />}
          {key2 && <Graphs data={key2} title={'JavaScript Ecosystem'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key3 && <Graphs data={key3} title={'Python and Related Frameworks'} />}
          {key4 && <Graphs data={key4} title={'Mobile Development (Non-JavaScript)'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key5 && <Graphs data={key5} title={'Backend Development & Web Frameworks'} />}
          {key6 && <Graphs data={key6} title={'Frontend & UI Development'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key7 && <Graphs data={key7} title={'Database Technologies'} />}
          {key8 && <Graphs data={key8} title={'Cloud Services & Serverless'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key9 && <Graphs data={key9} title={'DevOps & CI/CD Tools'} />}
          {key10 && <Graphs data={key10} title={'Version Control & Collaboration Tools'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key11 && <Graphs data={key11} title={'Content Management & E-commerce Platforms'} />}
          {key12 && <Graphs data={key12} title={'ERP, CRM & Automation Tools'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key13 && <Graphs data={key13} title={'Data Visualization & Business Intelligence'} />}
          {key14 && <Graphs data={key14} title={'Testing & QA Tools'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key15 && <Graphs data={key15} title={'APIs, Authentication & Security'} />}
          {key16 && <Graphs data={key16} title={'AI, ML, and Data Science'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key17 && <Graphs data={key17} title={'Web Sockets & Real-Time Communication'} />}
          {key18 && <Graphs data={key18} title={'Mobile App Deployment & ASO'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key19 && <Graphs data={key19} title={'Search Engine Optimization & Marketing'} />}
          {key20 && <Graphs data={key20} title={'Maps & Geolocation'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key21 && <Graphs data={key21} title={'Blockchain & Web3 Technologies'} />}
          {key22 && <Graphs data={key22} title={'Integration & Automation Tools'} />}
        </div>
        <div className="flex flex-row py-2 items-center w-[88%] justify-center mt-4">
          {key23 && <Graphs data={key23} title={'Programming Languages & Miscellaneous Tools'} />}
          {key24 && <Graphs data={key24} title={'Data Handling & Miscellaneous'} />}
        </div>
      </div>
    </>
  );
};

export default PersonalData;
