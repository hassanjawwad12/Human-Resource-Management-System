import React from 'react';

import {
  ListItemText,
  ListItemIcon,
  Chip,
  ListItemButton,
  Typography,
  Stack,
  useTheme,
  Box
} from '@mui/material';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import { IconAlertCircle, IconStar, IconTrash } from '@tabler/icons';
import { formatDistanceToNowStrict } from 'date-fns';

const EmailListItem = ({
  id,
  onClick,
  onChange,
  onStar,
  onImportant,
  from,
  subject,
  time,
  checked,
  label,
  starred,
  onDelete,
  important,
  isSelected,
}) => {
  const theme = useTheme();

  const warningColor = theme.palette.warning.main;
  const errorColor = theme.palette.error.light;

  return (
    <ListItemButton sx={{ mb: 1, py: 2 }} selected={isSelected} alignItems="flex-start">
      <Box>
        <ListItemIcon sx={{ minWidth: '35px', mt: '0' }}>
          <CustomCheckbox edge="start" id={`check${id}`} tabIndex={-1} onChange={onChange} />
        </ListItemIcon>
      </Box>
      {/* ------------------------------------------- */}
      {/* Email page */}
      {/* ------------------------------------------- */}
      <ListItemText onClick={onClick}>
        <Stack direction="row" gap="10px" alignItems="center">
          <Typography variant="subtitle2" mb={0.5} fontWeight={600} mr={'auto'}>
            {from}
          </Typography>
          <Chip
            label={label}
            size="small"
            color={label === 'Promotional' ? 'primary' : label === 'Social' ? 'error' : 'success'}
          />
        </Stack>
        <Typography variant="subtitle2" noWrap width={'80%'} color="text.secondary">
          {subject}
        </Typography>
        {/* ------------------------------------------- */}
        {/* Email page */}
        {/* ------------------------------------------- */}
        <Stack direction="row" mt={1} gap="10px" alignItems="center">
          <IconStar
            onClick={onStar}
            stroke={1}
            size="18"
            style={{ fill: starred ? warningColor : '', stroke: starred ? warningColor : '' }}
          />
          <IconAlertCircle
            onClick={onImportant}
            size="18"
            stroke={1.2}
            style={{ fill: important ? errorColor : '' }}
          />
          {/* ------------------------------------------- */}
          {/* Checked ? */}
          {/* ------------------------------------------- */}
          {checked ? <IconTrash onClick={onDelete} stroke={1.5} size="16" /> : ''}
          <Typography variant="caption" noWrap sx={{ ml: 'auto' }}>

            {formatDistanceToNowStrict(new Date(time), {
              addSuffix: false,
            })}{''}
            ago
          </Typography>
        </Stack>
      </ListItemText>
    </ListItemButton>
  );
};

export default EmailListItem;
