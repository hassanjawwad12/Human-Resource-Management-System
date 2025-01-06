import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  Divider,
  Stack,
  IconButton,
  Grid,
  Tooltip,
  Paper,
  useTheme,
} from '@mui/material';
import { IconStar, IconAlertCircle, IconTrash } from '@tabler/icons';
import { useSelector, useDispatch } from 'react-redux';
import { starEmail, importantEmail, deleteEmail } from '../../../store/apps/email/EmailSlice';
import emailIcon from 'src/assets/images/breadcrumb/emailSv.png';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../../views/forms/quill-editor/Quill.css';

const EmailContent = () => {
  const emailDetails = useSelector(
    (state) => state.emailReducer.emails[state.emailReducer.emailContent - 1],
  );

  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const toggleEditor = () => {
    setShow(!show);
  };

  const dispatch = useDispatch();

  const theme = useTheme();

  const warningColor = theme.palette.warning.main;
  const errorColor = theme.palette.error.light;

  return emailDetails && !emailDetails.trash ? (
    <Box>
      <Stack p={2} gap={0} direction="row">
        <Tooltip title={emailDetails.starred ? 'Unstar' : 'Star'}>
          <IconButton onClick={() => dispatch(starEmail(emailDetails.id))}>
            <IconStar
              stroke={1.3}
              size="18"
              style={{
                fill: emailDetails.starred ? warningColor : '',
                stroke: emailDetails.starred ? warningColor : '',
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={emailDetails ? 'Important' : 'Not Important'}>
          <IconButton onClick={() => dispatch(importantEmail(emailDetails.id))}>
            <IconAlertCircle
              size="18"
              stroke={1.3}
              style={{
                fill: emailDetails.important ? errorColor : '',
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => dispatch(deleteEmail(emailDetails.id))}>
            <IconTrash size="18" stroke={1.3} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider />
      <Box p={3}>
        {/* ------------------------------------------- */}
        {/* Email Detail page */}
        {/* ------------------------------------------- */}
        <Box display="flex" alignItems="center" sx={{ pb: 3 }}>
          <Avatar alt={emailDetails.from} src={emailDetails.thumbnail} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">{emailDetails.from}</Typography>
            <Typography variant="body2">{emailDetails.To}</Typography>
          </Box>
          <Chip
            label={emailDetails.label}
            sx={{ ml: 'auto', height: '21px' }}
            size="small"
            color={
              emailDetails.label === 'Promotional'
                ? 'primary'
                : emailDetails.label === 'Social'
                ? 'error'
                : 'success'
            }
          />
        </Box>
        {/* ------------------------------------------- */}
        {/* Email Detail page */}
        {/* ------------------------------------------- */}

        <Box sx={{ py: 2 }}>
          <Typography variant="h4">{emailDetails.subject}</Typography>
        </Box>

        <Box sx={{ py: 2 }}>
          <div dangerouslySetInnerHTML={{ __html: emailDetails.emailContent }} />
        </Box>
      </Box>
      {emailDetails?.attchments?.length === 0 ? null : (
        <>
          <Divider />
          <Box p={3}>
            <Typography variant="h6">Attachments ({emailDetails?.attchments?.length})</Typography>

            <Grid container spacing={3}>
              {emailDetails.attchments?.map((attach) => {
                return (
                  <Grid item lg={4} key={attach.id}>
                    <Stack direction="row" gap={2} mt={2}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: '48px',
                          height: '48px',
                          bgcolor: (theme) => theme.palette.grey[100],
                        }}
                      >
                        <Avatar
                          src={attach.image}
                          alt="av"
                          variant="rounded"
                          sx={{ width: '24px', height: '24px' }}
                        ></Avatar>
                      </Avatar>
                      <Box mr={'auto'}>
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                          {attach.title}
                        </Typography>
                        <Typography variant="body2">{attach.fileSize}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Divider />
        </>
      )}

      <Box p={3}>
        <Stack direction="row" gap={2}>
          <Button variant="outlined" size="small" color="primary" onClick={toggleEditor}>
            Reply
          </Button>
          <Button variant="outlined" size="small">
            Forward
          </Button>
        </Stack>

        {/* Editor */}
        {show ? (
          <Box mt={3}>
            <Paper variant="outlined">
              <ReactQuill
                value={text}
                onChange={(value) => {
                  setText(value);
                }}
                placeholder="Type here..."
              />
            </Paper>
          </Box>
        ) : null}
      </Box>
    </Box>
  ) : (
    <Box p={3} height="50vh" display={'flex'} justifyContent="center" alignItems={'center'}>
      {/* ------------------------------------------- */}
      {/* If no Email  */}
      {/* ------------------------------------------- */}
      <Box>
        <Typography variant="h4">Please Select a Mail</Typography>
        <br />
        <img src={emailIcon} alt={emailIcon} width={'250px'} />
      </Box>
    </Box>
  );
};

export default EmailContent;
