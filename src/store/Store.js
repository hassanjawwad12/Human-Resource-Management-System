import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import LoginReducer from './auth/login/LoginSlice';
import FirmReducer from './admin/FirmSlice';
import AdminReducer from './admin/AdminSlice';
import HRReducer from './hr/HRSlice';
import EmployeeReducer from './hr/EmployeeSlice';
import DepartmentReducer from './hr/DepartmentSlice';
import DesignationReducer from './hr/DesignationSlice';
import HolidayReducer from './hr/HolidaySlice';
import UserRightsReducer from './hr/UserRightsSlice';
import AttendanceReducer from './attendance/AttendanceSlice';
import ReportReducer from './report/ReportSlice';
import LeaveReducer from './leave/LeaveSlice';
import ProfileReducer from './auth/userProfile/ProfileSlice';
import CandidatesReducer from './candidates/CandidatesSlice';
import RotaReducer from './rota/RotaSlice.js';
import SignupUserReducer from './auth/signup/SignupSlice'

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    loginReducer: LoginReducer,
    signupReducer: SignupUserReducer,
    adminReducer: AdminReducer,
    firmReducer: FirmReducer,
    hrReducer: HRReducer,
    employeeReducer: EmployeeReducer,
    departmentReducer: DepartmentReducer,
    designationReducer: DesignationReducer,
    holidayReducer: HolidayReducer,
    userRightsReducer: UserRightsReducer,
    attendanceReducer: AttendanceReducer,
    reportReducer: ReportReducer,
    leaveReducer: LeaveReducer,
    profileReducer: ProfileReducer,
    candidatesReducer: CandidatesReducer,
    rotaReducer: RotaReducer
  },
});

export default store;
