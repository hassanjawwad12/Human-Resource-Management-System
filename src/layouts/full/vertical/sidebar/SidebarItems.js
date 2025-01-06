import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import * as TablerIcons from '@tabler/icons';
import { getSurveyDetails } from '../../../../store/attendance/AttendanceSlice';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.loginReducer);
  const [notFilled, SetnotFilled] = useState('false');

  useEffect(() => {
    const formData = new FormData();
    formData.append('employeeId', user.employeeId);
    formData.append('companyId', '52');
    dispatch(getSurveyDetails(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          SetnotFilled(false);
        } else {
          SetnotFilled(true);
        }
      })
      .catch((err) => {
      });
  }, []);

  const hasFirmManagementFeature = user.userFeatures.some(
    (feature) => feature.featureLabel === 'Firm Management',
  );

  const generateMenuItems = () => {
    if (!user.userFeatures || user.userFeatures.length === 0) {
      return [
        {
          id: 'admin',
          title: 'Admin Module',
          icon: TablerIcons.IconSettings2,
          href: '/admin',
        },
      ];
    }

    // Get unique modules and sort them based on featureGroupId
    const modules = [...new Set(user.userFeatures.map((feature) => feature.featureGroupLabel))];

    // Create menu items based on modules and sort them
    const sortedMenuItems = modules
      .map((module) => {
        const feature = user.userFeatures.find((f) => f.featureGroupLabel === module);
        const subFeatures = user.userFeatures.filter(
          (a) => a.featureGroupId === feature.featureGroupId,
        );

        // If there are no sub-features, treat it as a regular item
        const hasChildren = subFeatures.length > 0;

        return {
          id: module,
          title: module,
          isParent: true,
          icon: TablerIcons[feature.featureGroupIcon] || TablerIcons.IconApps,
          href: feature.featureGroupURL,
          featureGroupId: feature.featureGroupId,
          children: hasChildren ? subFeatures : null, // Only add children if there are more than one
        };
      })
      .sort((a, b) => a.featureGroupId - b.featureGroupId);

    // Remove featureGroupId from the final output
    return sortedMenuItems.map(({ featureGroupId, ...item }) => item);
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: TablerIcons.IconLayoutDashboard,
      href: '/dashboards/employee',
      isParent: true,
    },
    {
      id: 'survey',
      title: 'Survey',
      icon: TablerIcons.IconSquareChevronLeft,
      href: '/dashboards/survey',
      isParent: true,
    },
    ...(hasFirmManagementFeature
      ? [
          {
            id: 'surveyStats',
            title: 'Survey Statistics',
            icon: TablerIcons.IconChartBar,
            href: '/dashboards/V2',
            isParent: true,
          },
        ]
      : []),
    ...(notFilled
      ? [
          {
            id: 'employee-profiling',
            title: 'Employee Profiling',
            icon: TablerIcons.IconUserCircle,
            href: '/dashboards/employee-profiling',
            isParent: true,
          },
        ]
      : []),
    ...generateMenuItems(),
  ];

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.map((item) =>
          item.children ? (
            <NavCollapse
              menu={item}
              key={item.id}
              pathDirect={pathname}
              hideMenu={hideMenu}
              onClick={() => dispatch(toggleMobileSidebar())}
            />
          ) : (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathname}
              hideMenu={hideMenu}
              onClick={() => dispatch(toggleMobileSidebar())}
              isParent={item.isParent}
            />
          ),
        )}
      </List>
    </Box>
  );
};

export default SidebarItems;
