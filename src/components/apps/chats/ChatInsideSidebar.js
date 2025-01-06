import React from 'react';
import {
  Box,
  useMediaQuery,
  Typography,
  Stack,
  Avatar,
  Grid,
  Alert,
  IconButton,
  styled,
} from '@mui/material';
import { uniq, flatten } from 'lodash';
import { IconDownload } from '@tabler/icons';

const drawerWidth = 320;

const ChatInsideSidebar = ({ isInSidebar, chat }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const totalAttachment = uniq(flatten(chat?.messages.map((item) => item.attachment))).length;
  const totalMedia =
    uniq(flatten(chat?.messages.map((item) => (item?.type === 'image' ? item.msg : null)))).length -
    1;

  const StyledStack = styled(Stack)(() => ({
    '.showOnHover': {
      display: 'none',
    },
    '&:hover .showOnHover': {
      display: 'block',
    },
  }));

  return (
    <>
      {isInSidebar ? (
        <Box
          sx={{
            width: isInSidebar === true ? drawerWidth : 0,
            flexShrink: 0,
            border: '0',
            borderLeft: '1px',
            borderStyle: 'solid',
            right: '0',
            background: (theme) => theme.palette.background.paper,
            boxShadow: lgUp ? null : (theme) => theme.shadows[8],
            position: lgUp ? 'relative' : 'absolute',
            borderColor: (theme) => theme.palette.divider,
          }}
          p={3}
        >
          <Typography variant="h6" mb={2}>
            Media ({totalMedia})
          </Typography>
          <Grid container spacing={2}>
            {chat?.messages.map((c) => {
              return (
                <React.Fragment key={c.id}>
                  {c?.type === 'image' ? (
                    <Grid item xs={12} lg={4}>
                      <Avatar
                        src={c?.msg}
                        alt="media"
                        variant="rounded"
                        sx={{ width: '72px', height: '72px' }}
                      />
                    </Grid>
                  ) : null}
                </React.Fragment>
              );
            })}
            <Grid item xs={12} lg={12}>
              {totalMedia === 0 ? <Alert severity="error">No Media Found!</Alert> : null}
            </Grid>
          </Grid>

          <Typography variant="h6" mt={5} mb={2}>
            Attachments ({totalAttachment})
          </Typography>
          <Box>
            {chat?.messages.map((c, index) => {
              return (
                <Stack spacing={2.5} key={index} direction="column">
                  {c?.attachment?.map((a, index) => {
                    return (
                      <StyledStack key={index + a} direction="row" gap={2}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: '48px',
                            height: '48px',
                            bgcolor: (theme) => theme.palette.grey[100],
                          }}
                        >
                          <Avatar
                            src={a.icon}
                            alt="av"
                            variant="rounded"
                            sx={{ width: '24px', height: '24px' }}
                          ></Avatar>
                        </Avatar>
                        <Box mr={'auto'}>
                          <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            {a.file}
                          </Typography>
                          <Typography variant="body2">{a.fileSize}</Typography>
                        </Box>
                        <Box className="showOnHover">
                          <IconButton aria-label="delete">
                            <IconDownload stroke={1.5} size="20" />
                          </IconButton>
                        </Box>
                      </StyledStack>
                    );
                  })}
                </Stack>
              );
            })}
            {totalAttachment === 0 ? <Alert severity="error">No Attachment Found!</Alert> : null}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default ChatInsideSidebar;
