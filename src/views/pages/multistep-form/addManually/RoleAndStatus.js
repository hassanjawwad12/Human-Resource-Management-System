import { Box, Stack, fontSize } from '@mui/system';
import React, { useEffect, useState } from 'react';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import { Button, Dialog, DialogContent, DialogTitle, Grid, MenuItem, MenuList, Paper, Popper, Select, Typography } from '@mui/material';
import { getDepartmantsByFirm, getDesignationsByFirm, getUsersByFirm } from '../../../../store/hr/EmployeeSlice';
import { createNewDesignation } from '../../../../store/hr/DesignationSlice';
import { createNewDepartment } from '../../../../store/hr/DepartmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import AddIcon from '@mui/icons-material/Add';
import { color } from 'd3';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import AlertMessage from '../../../../components/shared/AlertMessage';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';
import * as Yup from 'yup';
import { IconLoader2 } from '@tabler/icons';

const RoleAndStatus = ({ formik, firmId }) => {

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.employeeReducer)
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState(false);

  const [popper, setPopper] = useState(false)

  const [addDesignation, setAddDesignation] = useState(false)
  const [addDepartment, setAddDepartment] = useState(false);

  useEffect(() => {
    let formData = new FormData();
    formData.append('firmId', firmId)
    dispatch(getDepartmantsByFirm(formData))
      .then((result) => {

        if (result.payload.SUCCESS === 1) {
          setDepartments(result.payload.DATA)
        }
      })
      .catch((error) => {
      });

    dispatch(getDesignationsByFirm(formData))
      .then((result) => {

        if (result.payload.SUCCESS === 1) {
          setDesignations(result.payload.DATA)
        }
     
      })
      .catch((error) => {
     
      });

  }, [designations.length, departments.length])

  return (
    <>
      {/* <CustomBackdrop loading={loading} /> */}
      <Stack direction={'row'} spacing={3}>
        <Box sx={{ width: "100%" }}>
          <Box className='flex items-center justify-between gap-3'>
            <CustomFormLabel htmlFor="departmentId">
              Department
            </CustomFormLabel>
            <Typography onClick={() => setAddDepartment(true)} sx={{ display: 'flex', justifyContent: 'center', mt: 2, px: '.4rem', minWidth: 'auto', color: 'primary.main', cursor: 'pointer', fontWeight: '600' }}>
              + Add
            </Typography>
          </Box>

          <Select
            id="departmentId"
            name="departmentId"
            value={formik.values.departmentId}
            onChange={formik.handleChange}
            error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
            fullWidth
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              <em>Select...</em>
            </MenuItem>
            {departments && departments.length > 0
              ? departments.map((obj, index) => (
                <MenuItem key={obj.id} value={obj.id}>
                  {obj.label}
                </MenuItem>
              ))
              : null}
          </Select>
          <span style={{ color: "#FA896B", fontSize: '0.75rem' }}>{formik.touched.departmentId && formik.errors.departmentId}</span>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box className='flex items-center justify-between gap-3'>
            <CustomFormLabel htmlFor="departmentId">
              Designation
            </CustomFormLabel>
            <Typography onClick={() => setAddDesignation(true)} sx={{ display: 'flex', justifyContent: 'center', mt: 2, px: '.4rem', minWidth: 'auto', color: 'primary.main', cursor: 'pointer', fontWeight: '600' }}>
              + Add
            </Typography>
          </Box>
          <Select
            id="designationId"
            name="designationId"

            value={formik.values.designationId}
            onChange={formik.handleChange}
            error={formik.touched.designationId && Boolean(formik.errors.designationId)}
            fullWidth
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              <em>Select...</em>
            </MenuItem>
            {designations && designations.length > 0
              ? designations.map((obj, index) => (
                <MenuItem key={obj.id} value={obj.id}>
                  {obj.label}
                </MenuItem>
              ))
              : null}
          </Select>
          <span style={{ color: "#FA896B", fontSize: '0.75rem' }}>{formik.touched.designationId && formik.errors.designationId}</span>
        </Box>
      </Stack >



      <Stack direction="row" spacing={3} justifyContent={'center'} mt={13}>
        {/* <Box sx={{ width: "100%" }}>
          <CustomFormLabel htmlFor="isAccountNonLocked">
            User Status
            <span style={{ color: "red", fontSize: "15px" }}>
              *
            </span>
          </CustomFormLabel>
          <Select
            id="isAccountNonLocked"
            name="isAccountNonLocked"
            value={formik.values.isAccountNonLocked}
            onChange={formik.handleChange}
            error={formik.touched.isAccountNonLocked && Boolean(formik.errors.isAccountNonLocked)}
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={0}>Block</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
          </Select>
          <span style={{ color: "#FA896B", fontSize: '0.75rem' }}>{formik.touched.isAccountNonLocked && formik.errors.isAccountNonLocked}</span>
        </Box>

        <Box sx={{ width: "100%" }}>
        </Box> */}

        {/* <Stack gap={1} alignItems={'center'} onMouseEnter={() => setPopper(true)} onMouseLeave={() => setPopper(false)}>

          <Button size='large' elevation={5} sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px', pr: '5px' }}>
            <AddIcon fontSize='inherit' />  Add new <ArrowDropDownIcon />
          </Button>
          {popper && <Paper>
            <MenuList sx={{ color: "#3f50b5" }} >
              <MenuItem onClick={() => setAddDepartment(true)} sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <AddIcon fontSize='inherit' /> Add new department
              </MenuItem>
              <MenuItem onClick={() => setAddDesignation(true)} sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <AddIcon fontSize='inherit' /> Add new designation
              </MenuItem>
            </MenuList>
          </Paper>}
        </Stack> */}

      </Stack >
      {addDesignation && <AddDesignation firmId={firmId} setAddDesignation={setAddDesignation} setDesignations={setDesignations} />}
      {addDepartment && <AddDepartment firmId={firmId} setAddDepartment={setAddDepartment} setDepartments={setDepartments} />}
    </>
  )
}

export function AddDesignation({ setAddDesignation, setDesignations, firmId, setItemAdded, edit }) {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const validationSchema = Yup.object({
    label: Yup.string().required('Designation is required'),
  });

  const formik = useFormik({
    initialValues: {
      label: '',
      firmId: firmId,
      id: '0'
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      let formData = new FormData();
      formData.append('label', values.label);
      formData.append('firmId', values.firmId);
      formData.append('id', values.id);
      setLoading(true)

      dispatch(createNewDesignation(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE
            });

            if (!edit) {
              setDesignations((prev) => [
                ...prev,
                { id: result.payload.id, label: values.label }
              ]);
            }
            else {
              setItemAdded(prev => prev + 1)
            }
            setLoading(false)
            setAddDesignation(false);
            resetForm();
          } else {
            setLoading(false)
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload
            });
          }
        })
        .catch((err) => {
          setLoading(false)
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.'
          });
        });
    },
  });

  return (
    <Dialog
      open
      onClose={() => setAddDesignation(false)}
      fullWidth
      maxWidth={'xs'}
    >
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      <Stack>
        <DialogTitle id="alert-dialog-title" variant="h4" sx={{ color: 'primary.main ' }}>
          {'Add new designation'}
        </DialogTitle>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box pb={'3rem'}>
            <Box className='flex'>
              <CustomFormLabel htmlFor="label" sx={{ mt: '0' }}>
                Designation
              </CustomFormLabel>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CustomTextField
                fullWidth
                id="label"
                name="label"
                variant="outlined"

                sx={{ flex: '1' }}
                type='text'
                value={formik.values.label}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.label && Boolean(formik.errors.label)}
                helperText={formik.touched.label && formik.errors.label}
              />
            </Box>
          </Box>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Button onClick={() => setAddDesignation(false)} variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
            >
              {loading ? <IconLoader2 className='animate-spin text-white' /> : 'Add'}
            </Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export function AddDepartment({ setAddDepartment, setDepartments, firmId, setItemAdded, edit }) {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const validationSchema = Yup.object({
    label: Yup.string().required('Department is required'),
  });

  const formik = useFormik({
    initialValues: {
      label: '',
      firmId: firmId,
      id: '0'
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      let formData = new FormData();
      formData.append('label', values.label);
      formData.append('firmId', values.firmId);
      formData.append('id', values.id);
      setLoading(true)
      dispatch(createNewDepartment(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE
            });
            if (!edit) {
              setDepartments((prev) => [
                ...prev,
                { id: result.payload.id, label: values.label }
              ]);
            } else {
              setItemAdded(prev => prev + 1)
            }
            setLoading(false)
            setAddDepartment(false);
            resetForm();
          } else {
            setLoading(false)
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload
            });
          }
        })
        .catch((err) => {
          setLoading(false)
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.'
          });
        });
    },
  });

  return (
    <Dialog
      open
      onClose={() => setAddDepartment(false)}
      fullWidth
      maxWidth={'xs'}
    >
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      <Stack>
        <DialogTitle id="alert-dialog-title" variant="h4" sx={{ color: 'primary.main ' }}>
          {'Add new department'}
        </DialogTitle>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box pb={'3rem'}>
            <CustomFormLabel htmlFor="label" sx={{ mt: '0' }}>
              Department
            </CustomFormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CustomTextField
                fullWidth
                id="label"
                name="label"
                variant="outlined"

                sx={{ flex: '1' }}
                type='text'
                value={formik.values.label}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.label && Boolean(formik.errors.label)}
                helperText={formik.touched.label && formik.errors.label}
              />
            </Box>
            {/* {formik.values.label && (
              <Typography sx={{ mt: 1, color: 'green' }}>
                {`"${formik.values.label}" was added`}
              </Typography>
            )} */}
          </Box>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Button onClick={() => setAddDepartment(false)} variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
            >
              {loading ? <IconLoader2 className='animate-spin text-white' /> : 'Add'}
            </Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  )
}



export default RoleAndStatus