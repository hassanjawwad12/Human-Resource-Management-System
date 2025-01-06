import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Stack,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  isEdit,
  UpdateContact,
  DeleteContact,
  toggleStarredContact,
} from 'src/store/apps/contacts/ContactSlice';
import BlankCard from '../../shared/BlankCard';
import { IconPencil, IconStar, IconTrash, IconDeviceFloppy } from '@tabler/icons';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import emailIcon from 'src/assets/images/breadcrumb/emailSv.png';

const ContactDetails = () => {
  const contactDetail = useSelector(
    (state) => state.contactsReducer.contacts[state.contactsReducer.contactContent - 1],
  );
  const editContact = useSelector((state) => state.contactsReducer.editContact);
  const dispatch = useDispatch();

  const tableData = [
    {
      id: 1,
      title: 'Firstname',
      alias: 'firstname',
      gdata: contactDetail ? contactDetail.firstname : '',
      type: 'text',
    },
    {
      id: 2,
      title: 'Lastname',
      alias: 'lastname',
      gdata: contactDetail ? contactDetail.lastname : '',
      type: 'text',
    },
    {
      id: 3,
      title: 'Company',
      alias: 'company',
      gdata: contactDetail ? contactDetail.company : '',
      type: 'text',
    },
    {
      id: 4,
      title: 'Department',
      alias: 'department',
      gdata: contactDetail ? contactDetail.department : '',
      type: 'text',
    },
    {
      id: 5,
      title: 'Email',
      alias: 'email',
      gdata: contactDetail ? contactDetail.email : '',
      type: 'email',
    },
    {
      id: 6,
      title: 'Phone',
      alias: 'phone',
      gdata: contactDetail ? contactDetail.phone : '',
      type: 'phone',
    },
    {
      id: 7,
      title: 'Address',
      alias: 'address',
      gdata: contactDetail ? contactDetail.address : '',
      type: 'text',
    },
    {
      id: 8,
      title: 'Notes',
      alias: 'notes',
      gdata: contactDetail ? contactDetail.notes : '',
      type: 'text',
    },
  ];

  return (
    <>
      {/* ------------------------------------------- */}
      {/* Contact Detail Part */}
      {/* ------------------------------------------- */}
      {contactDetail && !contactDetail.deleted ? (
        <>
          {/* ------------------------------------------- */}
          {/* Header Part */}
          {/* ------------------------------------------- */}
          <Box p={3} py={2} display={'flex'} alignItems="center">
            <Typography variant="h5">Contact Details</Typography>
            <Stack gap={0} direction="row" ml={'auto'}>
              <Tooltip title={contactDetail.starred ? 'Unstar' : 'Star'}>
                <IconButton onClick={() => dispatch(toggleStarredContact(contactDetail.id))}>
                  <IconStar
                    stroke={1.3}
                    size="18"
                    style={{
                      fill: contactDetail.starred ? '#FFC107' : '',
                      stroke: contactDetail.starred ? '#FFC107' : '',
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title={editContact ? 'Save' : 'Edit'}>
                <IconButton onClick={() => dispatch(isEdit())}>
                  {!editContact ? (
                    <IconPencil size="18" stroke={1.3} />
                  ) : (
                    <IconDeviceFloppy size="18" stroke={1.3} />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton>
                  <IconTrash size="18" stroke={1.3} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          <Divider />
          {/* ------------------------------------------- */}
          {/* Contact Table Part */}
          {/* ------------------------------------------- */}
          <Box sx={{ overflow: 'auto' }}>
            {!editContact ? (
              <Box>
                <Box p={3}>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      alt={contactDetail.image}
                      src={contactDetail.image}
                      sx={{ width: '72px', height: '72px' }}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" mb={0.5}>
                        {contactDetail.firstname} {contactDetail.lastname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        {contactDetail.department}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {contactDetail.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container>
                    <Grid item lg={6} xs={12} mt={4}>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {contactDetail.phone}
                      </Typography>
                    </Grid>
                    <Grid item lg={6} xs={12} mt={4}>
                      <Typography variant="body2" color="text.secondary">
                        Email address
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {contactDetail.email}
                      </Typography>
                    </Grid>
                    <Grid item lg={12} xs={12} mt={4}>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {contactDetail.address}
                      </Typography>
                    </Grid>
                    <Grid item lg={6} xs={12} mt={4}>
                      <Typography variant="body2" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {contactDetail.department}
                      </Typography>
                    </Grid>
                    <Grid item lg={6} xs={12} mt={4}>
                      <Typography variant="body2" color="text.secondary">
                        Company
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {contactDetail.company}
                      </Typography>
                    </Grid>
                    <Grid item lg={12} xs={12} mt={4}>
                      <Typography variant="body2" mb={1} color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5}>
                        {contactDetail.notes}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider />
                <Box p={3} gap={1} display="flex">
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => dispatch(isEdit())}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() => dispatch(DeleteContact(contactDetail.id))}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <BlankCard sx={{ p: 0 }}>
                  <Scrollbar sx={{ height: { lg: 'calc(100vh - 360px)', md: '100vh' } }}>
                    <Box pt={1}>
                      {tableData.map((data) => (
                        <Box key={data.id} px={3} py={1.5}>
                          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                            {data.title}
                          </Typography>
                          <TextField
                            id="firstname"
                            size="small"
                            fullWidth
                            type="text"
                            value={data.gdata}
                            onChange={(e) =>
                              dispatch(UpdateContact(contactDetail.id, data.alias, e.target.value))
                            }
                          />
                        </Box>
                      ))}
                      <Box p={3}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => dispatch(isEdit())}
                        >
                          Save Contact
                        </Button>
                      </Box>
                    </Box>
                  </Scrollbar>
                </BlankCard>
              </>
            )}
          </Box>
        </>
      ) : (
        <Box p={3} height="50vh" display={'flex'} justifyContent="center" alignItems={'center'}>
          {/* ------------------------------------------- */}
          {/* If no Contact  */}
          {/* ------------------------------------------- */}
          <Box>
            <Typography variant="h4">Please Select a Contact</Typography>
            <br />
            <img src={emailIcon} alt={emailIcon} width={'250px'} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default ContactDetails;
