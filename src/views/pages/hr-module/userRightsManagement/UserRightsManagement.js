import React, { useState } from 'react';
import { Box, Typography, Button, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';

const validationSchema = yup.object({
  userId: yup.string().required('User is Required'),
});

// Dummy data
const dummyUsers = [
  { id: '1', label: 'John Doe' },
  { id: '2', label: 'Jane Smith' },
  { id: '3', label: 'Bob Johnson' },
];

const dummyFeatures = [
  {
    id: '1',
    label: 'User Management',
    features: [
      { id: '1-1', label: 'Create User', isChecked: 1 },
      { id: '1-2', label: 'Edit User', isChecked: 0 },
      { id: '1-3', label: 'Delete User', isChecked: 1 },
    ]
  },
  {
    id: '2',
    label: 'Content Management',
    features: [
      { id: '2-1', label: 'Create Content', isChecked: 1 },
      { id: '2-2', label: 'Edit Content', isChecked: 1 },
      { id: '2-3', label: 'Publish Content', isChecked: 0 },
    ]
  },
];

const UserRightsManagement = () => {
  const [userFeatures, setUserFeatures] = useState([]);

  const formik = useFormik({
    initialValues: {
      userId: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      console.log('User Features:', userFeatures);
    },
  });

  const handleUserChange = (event) => {
    formik.handleChange(event);
    // Simulate fetching user features
    setUserFeatures(dummyFeatures);
  };

  const handleFeatureToggle = (moduleId, featureId) => {
    setUserFeatures(prevFeatures =>
      prevFeatures.map(module =>
        module.id === moduleId
          ? {
            ...module,
            features: module.features.map(feature =>
              feature.id === featureId
                ? { ...feature, isChecked: feature.isChecked === 1 ? 0 : 1 }
                : feature
            )
          }
          : module
      )
    );
  };

  const BCrumb = [
    {
      to: '/hr',
      title: 'HR',
    },
    {
      title: 'User Rights Management',
    }
  ];

  return (
    <>
      {/* <Breadcrumb title="User Rights Management" items={BCrumb} /> */}

      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Stack mb={3}>
            <Box sx={{ width: "100%" }}>
              <CustomFormLabel htmlFor="userId">
                Select User
              </CustomFormLabel>
              <Select
                id="userId"
                name="userId"
                value={formik.values.userId}
                onChange={handleUserChange}
                error={formik.touched.userId && Boolean(formik.errors.userId)}
                fullWidth
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="" disabled>
                  <em>Select...</em>
                </MenuItem>
                {dummyUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.label}
                  </MenuItem>
                ))}
              </Select>
              <span style={{ color: "#FA896B", fontSize: '0.75rem' }}>{formik.touched.userId && formik.errors.userId}</span>
            </Box>
          </Stack>

          {formik.values.userId && userFeatures.length > 0 && (
            <Box mb={3}>
              {userFeatures.map((module) => (
                <Accordion key={module.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${module.id}-content`}
                    id={`panel-${module.id}-header`}
                  >
                    {module.label}
                  </AccordionSummary>
                  <AccordionDetails>
                    {module.features.map((feature) => (
                      <Stack key={feature.id} direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography>
                          {feature.id + " - " + feature.label}
                        </Typography>
                        <CustomCheckbox
                          checked={feature.isChecked === 1}
                          onChange={() => handleFeatureToggle(module.id, feature.id)}
                          inputProps={{ 'aria-label': 'feature checkbox' }}
                        />
                      </Stack>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Box></Box>
            {formik.values.userId && (
              <Button
                color="primary"
                variant="contained"
                size="large"
                type='submit'
              >
                Save
              </Button>
            )}
          </Stack>
        </Box>
      </form>
    </>
  );
};

export default UserRightsManagement;
