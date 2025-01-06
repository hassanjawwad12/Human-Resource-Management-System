
import React from 'react';
import {
  ListItemText,
  Box,
  Avatar,
  ListItemButton,
  Typography,
  Stack,
  ListItemAvatar,
} from '@mui/material';

import { IconStar, IconTrash } from '@tabler/icons';


const ContactListItem = ({
  onContactClick,
  onStarredClick,
  onDeleteClick,
  id,
  firstname,
  lastname,
  image,
  department,
  starred,
  active,
}) => {

  return (
    <ListItemButton sx={{ mb: 1 }} selected={active}>
      <ListItemAvatar>
        <Avatar alt={image} src={image} />
      </ListItemAvatar>
      <ListItemText>
        <Stack direction="row" gap="10px" alignItems="center">
          <Box mr="auto" onClick={onContactClick}>
            <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '150px' }}>
              {firstname} {lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {department}
            </Typography>
          </Box>
          <IconStar
            onClick={onStarredClick}
            size="16"
            stroke={1.5}
            style={{ fill: starred ? '#FFC107' : '', stroke: starred ? '#FFC107' : '' }}
          />
          <IconTrash onClick={onDeleteClick} size="16" stroke={1.5} />
        </Stack>
      </ListItemText>
    </ListItemButton>
  );
};


export default ContactListItem;
