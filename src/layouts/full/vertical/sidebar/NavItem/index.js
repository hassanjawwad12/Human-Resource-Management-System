import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  RoomPreferences as RoomPreferencesIcon,
  TableRows as TableRowsIcon,
  CalendarMonth as CalendarMonthIcon,
  CopyAll as CopyAllIcon,
  Fingerprint as FingerprintIcon,
  PendingActions as PendingActionsIcon,
  DateRange as DateRangeIcon,
  AccountCircle as AccountCircleIcon,
  Key as KeyIcon,
  Domain as DomainIcon,
  ManageAccounts as ManageAccountsIcon,
  PersonRemove as PersonRemoveIcon,
  Schema as SchemaIcon,
  EditCalendar as EditCalendarIcon

} from '@mui/icons-material';

const iconMap = {
  RoomPreferencesIcon,
  TableRowsIcon,
  CalendarMonthIcon,
  CopyAllIcon,
  FingerprintIcon,
  PendingActionsIcon,
  DateRangeIcon,
  AccountCircleIcon,
  KeyIcon,
  DomainIcon,
  ManageAccountsIcon,
  PersonRemoveIcon,
  SchemaIcon,
  EditCalendarIcon,
};


const NavItem = ({ item, level, onClick, hideMenu, isParent }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = item.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  const itemIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

  const ListItemStyled = styled(ListItem)(({ theme, active }) => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    fontSize: '14px',
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: theme.palette.text.secondary,
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&.active': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={item.external ? 'a' : NavLink}
        to={!item.external ? (isParent ? item.href : item.featureURL) : undefined}
        href={item.external ? (isParent ? item.href : item.featureURL) : undefined}
        disabled={item.disabled}
        target={item.external ? '_blank' : undefined}
        onClick={onClick}
        activeClassName="active" 
      >
        {isParent ? (
          <ListItemIcon
            sx={{
              minWidth: '20px',
              p: '3px 0',
              color: 'inherit',
              pr: '0.8rem'
            }}
          >
            {itemIcon}
          </ListItemIcon>
        ) : (
          React.createElement(iconMap[item.featureIcon] || 'span', {
            style: { 
              //color: theme.palette.primary.main,
              color:'inherit',
              paddingRight: '0.5rem' ,
              fontSize: '28px',

            },
          })   
        )}

        <Typography sx={{fontSize: isParent ? '': '13px'}}>
          {hideMenu ? '' : <>{t(`${isParent ? item.title : item.featureLabel}`)}</>}
          <br />
          {item.subtitle ? (
            <Typography sx={{ fontSize: 10 }}  >{hideMenu ? '' : item.subtitle}</Typography>
          ) : (
            ''
          )}
        </Typography>
        {!item.chip || hideMenu ? null : (
          <Chip
            color={item.chipColor}
            variant={item.variant ? item.variant : 'filled'}
            size="small"
            label={item.chip}
          />
        )}
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
