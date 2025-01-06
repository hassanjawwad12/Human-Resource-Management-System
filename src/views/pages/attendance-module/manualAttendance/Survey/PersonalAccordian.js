import React from 'react';
import { Typography } from '@mui/material';
import { FaEnvelope } from 'react-icons/fa';
import { IoIosPerson } from 'react-icons/io';
import { RiIdCardFill } from 'react-icons/ri';
import { MdBloodtype } from 'react-icons/md';
import { AiOutlinePhone } from 'react-icons/ai';
import { MdContactEmergency, MdLocationOn } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';

const PersonalAccordian = ({ data }) => {
  return (
    <div className="flex flex-row w-full items-center justify-between py-2">
      <div className="flex flex-col items-start">
        <div className="flex flex-row gap-3 items-center">
          <div className="rounded-full bg-[#D9E6FE] text-[#4E7CFE] w-10 h-10 flex items-center justify-center">
            <IoIosPerson className="text-2xl" />
          </div>
          <Typography variant="h6">{data?.full_name}</Typography>
        </div>

        <div className="flex flex-row gap-3 items-center mt-4">
          <div className="rounded-full bg-green-200 text-[#2EC32E] w-10 h-10 flex items-center justify-center">
            <RiIdCardFill className="text-xl" />
          </div>
          <Typography variant="h6">{data?.cnic_number}</Typography>
        </div>

        <div className="flex flex-row gap-3 items-center mt-4">
          <div className="rounded-full bg-[#FFE3E2] text-[#FE4C48]  w-10 h-10 flex items-center justify-center">
            <MdBloodtype className="text-xl" />
          </div>
          <Typography variant="h6">{data?.blood_group}</Typography>
        </div>
      </div>

      <div className="flex flex-col items-start">
        <div className="flex flex-row gap-3 items-center">
          <div className="rounded-full bg-[#E2DBFD] text-[#785DE7] w-10 h-10 flex items-center justify-center">
            <AiOutlinePhone className="text-xl" />
          </div>
          <Typography variant="h6">{data?.contact_number}</Typography>
        </div>

        <div className="flex flex-row gap-3 items-center mt-4">
          <div className="rounded-full bg-[#FFE3E2] text-[#FE4C48] w-10 h-10 flex items-center justify-center">
            <MdContactEmergency className="text-xl" />
          </div>
          <Typography variant="h6">{data?.emergency_number}</Typography>
        </div>

        <div className="flex flex-row gap-3 items-center mt-4">
          <div className="rounded-full bg-[#69DCC74D] text-[#69DCC7] w-10 h-10 flex items-center justify-center">
            <FaEnvelope className="text-xl" />
          </div>
          <Typography variant="h6">{data?.personal_email}</Typography>
        </div>
      </div>

      <div className="flex flex-col items-start">
        <div className="flex flex-row gap-3 items-center ">
          <div className="rounded-full bg-[#AC44DD33] text-[#AC44DD] w-10 h-10 flex items-center justify-center">
            <FaHome className="text-xl" />
          </div>
          <Typography variant="h6">{data?.home_address}</Typography>
        </div>

        <div className="flex flex-row gap-3 items-center mt-4 mb-14">
          <div className="rounded-full bg-[#CAB1B133] text-[#A08787] w-10 h-10 flex items-center justify-center">
            <MdLocationOn className="text-xl" />
          </div>
          <Typography variant="h6">{data?.current_address}</Typography>
        </div>
      </div>
    </div>
  );
};

export default PersonalAccordian;
