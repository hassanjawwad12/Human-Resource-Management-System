import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const Calendar = Loadable(lazy(() => import('../views/pages/hr-module/calendar/HolidayCalendar')));
const ModuleFeatures = Loadable(lazy(() => import('./ModuleFeatures')));
const ProtectedRoute = Loadable(lazy(() => import('./ProtectedRoute')));

//AUTH
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));
const EmployeeDashboard = Loadable(
  lazy(() =>
    import('../views/pages/attendance-module/manualAttendance/EmployeeDashboard/Dashboard'),
  ),
);

const SurveryFormSubmission = Loadable(
  lazy(() => import('../views/pages/SurveryFormSubmission/surveyDashboard')),
);
const EmployeeProfilingForm = Loadable(
  lazy(() => import('../views/pages/EmployeeProfiling/EmployeeProfiling')),
);




// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));
const ResetPassword = Loadable(lazy(() => import('../views/authentication/auth1/ResetPassword')));

//Admin module
const AdminModule = Loadable(lazy(() => import('../views/pages/admin-module/AdminModule')));
const FirmManagement = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FirmManagement')),
);
const FirmDetails = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FirmDetails')),
);
const FirmSchedulePicker = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FirmSchedulePicker')),
);
const FeatureAssignmentTable = Loadable(
  lazy(() => import('../views/pages/admin-module/firmManagement/FeatureAssignmenttable')),
);

//HR MODULE
const HRModule = Loadable(lazy(() => import('../views/pages/hr-module/HRModule')));
const EnrollEmployee = Loadable(
  lazy(() => import('../views/pages/hr-module/userManagement/EnrollEmployee')),
);
const EmployeesList = Loadable(
  lazy(() => import('../views/pages/hr-module/userManagement/EmployeesList')),
);
const UserList = Loadable(lazy(() => import('../views/pages/hr-module/userManagement/UsersList')));
const DeptManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/deptManagement/DeptManagement')),
);
const DeptList = Loadable(lazy(() => import('../views/pages/hr-module/deptManagement/DeptList')));
const DesignationManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/designationManagement/DesignationManagement')),
);
const DesignationList = Loadable(
  lazy(() => import('../views/pages/hr-module/designationManagement/DesignationsList')),
);
const HolidayManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/holidayManagement/HolidayManagement')),
);
const HolidayList = Loadable(
  lazy(() => import('../views/pages/hr-module/holidayManagement/HolidayList')),
);
const UserRightsManagement = Loadable(
  lazy(() => import('../views/pages/hr-module/userRightsManagement/UserRightsManagement')),
);
const RightsDetails = Loadable(
  lazy(() => import('../views/pages/hr-module/userRightsManagement/RightsDetails')),
);

//Attendance module
const AttendanceModule = Loadable(
  lazy(() => import('../views/pages/attendance-module/AttendanceModule')),
);
const ManualAttendance = Loadable(
  lazy(() => import('../views/pages/attendance-module/manualAttendance/ManualAttendance')),
);
const ManualAttendanceList = Loadable(
  lazy(() => import('../views/pages/attendance-module/manualAttendance/ManualAttendanceList')),
);
const MonthlyAttendanceCalendar = Loadable(
  lazy(() => import('../views/pages/attendance-module/manualAttendance/MonthlyAttendance')),
);
const StandaloneAttendance = Loadable(
  lazy(() => import('../views/pages/attendance-module/manualAttendance/StandaloneAttendance')),
);

//leave module goes here
const LeaveCalendar = Loadable(
  lazy(() => import('../views/pages/leave-module/leaveManagement/LeaveCalendar')),
);
const LeaveEntitlementManager = Loadable(
  lazy(() => import('../views/pages/leave-module/leaveManagement/LeaveEntitlementManager')),
);
const LeaveApproval = Loadable(
  lazy(() => import('../views/pages/leave-module/leaveManagement/Approval')),
);

//Rota Module
const RotaModule = Loadable(lazy(() => import('../views/pages/rota-module/RotaModule')));
const RotaSchedule = Loadable(lazy(() => import('../views/pages/rota-module/Schedule')));
const TeamManagement = Loadable(lazy(() => import('../views/pages/rota-module/TeamManagement')));
const ShiftManager = Loadable(lazy(() => import('../views/pages/rota-module/ShiftManager')));
const ShiftCloner = Loadable(lazy(() => import('../views/pages/rota-module/ShiftCloner')));
const AddEmployees = Loadable(lazy(() => import('../views/pages/addEmployees/AddEmployees')));
const MultistepForm = Loadable(lazy(() => import('../views/pages/multistep-form/MultistepForm')));

const DashboardV2 = Loadable(lazy(() => import('../views/dashboard/DashboardV2')));

const Router = (isAuthenticated) => [
  {
    path: '/',
    element: isAuthenticated ? <FullLayout /> : <Navigate to="/auth/login" />,
    children: isAuthenticated && [
      { path: '/dashboards/employee', element: <EmployeeDashboard /> },
      // { path: '/dashboards/modern', exact: true, element: <EmployeeDashboard /> },
      { path: '/dashboards/employee', exact: true, element: <EmployeeDashboard /> },
      { path: '/dashboards/survey', exact: true, element: <SurveryFormSubmission /> },
      { path: '/dashboards/v2', exact: true, element: <DashboardV2 /> },
      { path: '/dashboards/employee-profiling', exact: true, element: <EmployeeProfilingForm /> },
      // Protected Admin routes
    
      {
        path: '/admin/addEmployees/:id',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <AddEmployees />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/addSchedule/:id',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <FirmSchedulePicker />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/add-employee-wizard/:id',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <MultistepForm />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/add-companies',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <FirmManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/firmDetails',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <FirmDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/featureAssignment',
        element: (
          <ProtectedRoute requiredFeature="Admin Module">
            <FeatureAssignmentTable />
          </ProtectedRoute>
        ),
      },

      //hr module
      {
        path: '/hr',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <ModuleFeatures moduleName="HR Module" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/view-employees',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <EmployeesList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/add-department',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <DeptManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/add-designation',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <DesignationManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/add-holiday',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <HolidayManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/holiday-calendar',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <Calendar />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/add-rights',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <UserRightsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/employeesList',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <UserList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/departmentList',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <DeptList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/designationList',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <DesignationList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/holidayList',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <HolidayList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/user-rights',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <RightsDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hr/enrollEmployee',
        element: (
          <ProtectedRoute requiredFeature="HR Module">
            <EnrollEmployee />
          </ProtectedRoute>
        ),
      },
      { path: '/hr/leaveCalendar', element: <LeaveCalendar /> },
      { path: '/hr/leaveManager', element: <LeaveEntitlementManager /> },
      { path: '/hr/leaveApproval', element: <LeaveApproval /> },
      {
        path: '/hr/manage',
        element: (
          <ProtectedRoute requiredFeature="Rota Module">
            <TeamManagement />
          </ProtectedRoute>
        ),
      },

      //Attendance module
      {
        path: '/attendance',
        element: (
          <ProtectedRoute requiredFeature="Attendance Module">
            <ModuleFeatures moduleName="Attendance Module" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/attendance/add-manualAttendance',
        element: (
          <ProtectedRoute requiredFeature="Attendance Module">
            <ManualAttendance />
          </ProtectedRoute>
        ),
      },
      {
        path: '/attendance/attendanceList',
        element: (
          <ProtectedRoute requiredFeature="Attendance Module">
            <ManualAttendanceList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/attendance/monthlyAttendance',
        element: (
          <ProtectedRoute requiredFeature="Attendance Module">
            <MonthlyAttendanceCalendar />
          </ProtectedRoute>
        ),
      },

      //Rota module
      {
        path: '/rota',
        element: (
          <ProtectedRoute requiredFeature="Rota Module">
            <ModuleFeatures moduleName="Rota Module" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rota/schedule',
        element: (
          <ProtectedRoute requiredFeature="Rota Module">
            <RotaSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rota/manageShift',
        element: (
          <ProtectedRoute requiredFeature="Rota Module">
            <ShiftManager />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rota/cloneShift',
        element: (
          <ProtectedRoute requiredFeature="Rota Module">
            <ShiftCloner />
          </ProtectedRoute>
        ),
      },

      { path: '*', element: <Navigate to="/dashboards/employee" /> },
    ],
  },
  {
    path: '/',
    element: !isAuthenticated ? <BlankLayout /> : <Navigate to="dashboards/modern" />,
    children: !isAuthenticated && [
      { path: '/attendance/standalone/:id', element: <StandaloneAttendance /> },
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/reset-password/:u/:o', element: <ResetPassword /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '*', element: <Navigate to="/auth/login" /> },
    ],
  },
];

export default Router;
