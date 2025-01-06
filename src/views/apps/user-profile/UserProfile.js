import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Fade,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileByUser, updateProfileByUser, updateProfileImageByUser, getProfileImageByFileName } from '../../../store/auth/userProfile/ProfileSlice';
import { updateUserData } from '../../../store/auth/login/LoginSlice';
import AlertMessage from '../../../components/shared/AlertMessage';
import CustomPasswordField from '../../../components/forms/theme-elements/CustomPasswordField';
import { displayName } from 'react-quill';
import { getAllCountries } from '../../../store/admin/FirmSlice';
import CountrySelect from '../../pages/admin-module/firmManagement/CountrySelector';
import { useNavigate } from 'react-router';
import UploadIcon from '@mui/icons-material/Upload';
import { PhotoCamera } from '@mui/icons-material';
import UploadAvatar from './UploadAvatar';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { PhoneNumberUtil } from 'google-libphonenumber';


const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone, countryId) => {
  const fullNumber = '+' + countryId?.phoneCode + phone
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(fullNumber));
  } catch (error) {
    return false;
  }
};

const validationSchema = yup.object({
  firstName: yup.string()
    .test('trim', 'First Name cannot have leading or trailing spaces', value => {
      if (value) {
        return value.trim() === value; // Check if trimmed value is same as original value
      }
      return true; // Allow empty value
    })
    .test('no-extra-spaces', 'First Name cannot have more than one space between characters', value => {
      if (value) {
        return !/\s{2,}/.test(value); // Check if there are no more than one space between characters
      }
      return true; // Allow empty value
    })
    .required('First Name is Required').min(2, 'Too Short!').max(20, 'Too Long!'),
  lastName: yup.string()
    .test('trim', 'Last Name cannot have leading or trailing spaces', value => {
      if (value) {
        return value.trim() === value; // Check if trimmed value is same as original value
      }
      return true; // Allow empty value
    })
    .test('no-extra-spaces', 'Last Name cannot have more than one space between characters', value => {
      if (value) {
        return !/\s{2,}/.test(value); // Check if there are no more than one space between characters
      }
      return true; // Allow empty value
    })
    .required('Last Name is Required').min(2, 'Too Short!').max(20, 'Too Long!'),
  contactNo: yup
    .string()
    .required('Contact No is Required')
    .test('is-phone-valid', 'Phone number is not valid', function (value) {
      const { countryId } = this?.parent;
      return countryId ? isPhoneValid(value, countryId) : false;
    }),
  // cnicNo: yup
  //   .string().nullable()
  //   .required('National ID is Required').min(13, 'Too Short!').max(20, 'Too Long!'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  // bankAccountNo: yup
  //   .string()
  //   .required('Bank Account is Required').min(5, 'Too Short!').max(34, 'Too Long!'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup.string().when('password', {
    is: (val) => (val && val.length > 0 ? true : false),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same').required('Confirm password is required')
  }),
});


const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userData = useSelector((state) => state.profileReducer.profileData);
  const { user } = useSelector((state) => state.loginReducer)
  const [countries, setCountries] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const [formSubmitting, setFormSubmiting] = React.useState(false)

  const [avatar, setAvatar] = React.useState(null);

  const [alert, setAlert] = React.useState({
    open: false,
    severity: '',
    message: ''
  });

  const [avatarData, setAvatarData] = React.useState({
    preview: null,
    file: null,
    fileName: ''
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      firstName: '',
      lastName: '',
      contactNo: '',
      cnicNo: '',
      email: '',
      countryId: null,
      bankAccountNo: '',
      password: '',
      confirmPassword: '',
      genderId: '',
      occuptionId: 154,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const tranformedValues = {
        ...values,
        originOfPassportId: values.countryId?.id || 76,
        displayName: `${values.firstName} ${values.lastName}`,
        occuptionId: 154,
        cnic: values.cnicNo

      }

      dispatch(updateUserData({
        ...user,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        profileFileName: avatarData.preview,
        targetFileName: avatarData.fileName,
      }))
      let formData = new FormData();
      let formDataImg = new FormData()

      formDataImg.append('file', avatarData.file)
      formDataImg.append('userId', values.id)

      for (const key in tranformedValues) {
        formData.append(key, tranformedValues[key])
      }

      if (!values.password) {
        formData.append('password', userData.rawPassword)
      }
      setFormSubmiting(true)
      dispatch(updateProfileByUser(formData))
        .then((result) => {

          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE
            })
            setFormSubmiting(false)
            // setTimeout(() => {
            //   navigate('/dashboards/modern')
            // }, 500)
          }
          else {
            setFormSubmiting(false)
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload
            })
          }
        })
        .catch((err) => {
          setFormSubmiting(false)
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.'
          })
        });

      dispatch(updateProfileImageByUser(formDataImg))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            // setAlert({
            //   open: true,
            //   severity: 'success',
            //   message: result.payload.USER_MESSAGE
            // })
          }
          else {
            setFormSubmiting(false)
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload
            })
          }
        })
        .catch((err) => {
          setFormSubmiting(false)
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.'
          })
        });
    },
  });


  React.useEffect(() => {
    let fetchedCountries = []

    dispatch(getAllCountries())
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          fetchedCountries = result.payload.DATA
          setCountries(result.payload.DATA);
          return dispatch(getProfileByUser())
        }
      })
      .then((result) => {

        if (result.payload.SUCCESS === 1) {
          setLoading(false)
          formik.setValues({
            id: result.payload.DATA.id,
            firstName: result.payload.DATA.firstName,
            lastName: result.payload.DATA.lastName,
            contactNo: result.payload.DATA.contactNo,
            cnicNo: result.payload.DATA.cnic,
            email: result.payload.DATA.email,
            bankAccountNo: result.payload.DATA.bankAccount,
            password: result.payload.DATA.rawPassword,
            countryId: (fetchedCountries.find(item => item.id === result.payload.DATA?.orginOfPassportId) || null),
            confirmPassword: result.payload.DATA.rawPassword,
            genderId: result.payload.DATA.genderId,
          })
          setAlert({
            open: true,
            severity: 'success',
            message: 'User data retrieved successfully'
          })
          setAvatarData(prev => ({ ...prev, preview: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${result.payload.DATA.targetFileName}`, fileName: result.payload.DATA.targetFileName }))
        }
        else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload
          })
        }
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.'
        })
      });
  }, [])
  const BCrumb = [
    {
      to: '/attendance',
      title: 'Update your profile',
    },
  ];
  console.log(avatar)
  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      {/* <Breadcrumb title="Update Profile" items={BCrumb} /> */}
      {loading ?
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
            <Stack direction="row" alignItems="center">
              <Skeleton variant="circular" width={100} height={100} />
            </Stack>
          </Stack>

          {[1, 2].map((row) => (
            <Stack key={row} direction="row" spacing={3} mt={3} sx={{ width: '100%' }}>
              {[1, 2, 3].map((col) => (
                <Box key={col} sx={{ width: '100%' }}>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="rounded" height={46} />
                </Box>
              ))}
            </Stack>
          ))}

          <Stack direction="row" spacing={3} mt={3} sx={{ width: '100%' }}>
            {[1, 2, 3].map((col) => (
              <Box key={col} sx={{ width: '100%' }}>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="rounded" height={46} />
              </Box>
            ))}
          </Stack>

          <Stack alignItems="flex-end" mt={3}>
            <Skeleton variant="rounded" height={46} />
          </Stack>
        </Box>
        :
        <Fade in>
          <form onSubmit={formik.handleSubmit}>
            <Stack container spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
                <Stack direction="row" alignItems="center">
                  <UploadAvatar avatarData={avatarData} setAvatarData={setAvatarData} />
                </Stack>
              </Stack>
              <Stack direction="row" spacing={3} mt={3} sx={{ width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="firstName">
                    First Name
                    <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span>
                  </CustomFormLabel>
                  <CustomTextField
                    variant="outlined" fullWidth
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}

                  />
                </Box>

                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="lastName">
                    Last Name
                    <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span>
                  </CustomFormLabel>
                  <CustomTextField
                    variant="outlined" fullWidth
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}

                  />
                </Box>

                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="bankAccountNo">
                    Bank Account

                  </CustomFormLabel>
                  <CustomTextField
                    variant="outlined" fullWidth
                    id="bankAccountNo"
                    name="bankAccountNo"
                    value={formik.values.bankAccountNo}
                    onChange={formik.handleChange}
                    error={formik.touched.bankAccountNo && Boolean(formik.errors.bankAccountNo)}
                    helperText={formik.touched.bankAccountNo && formik.errors.bankAccountNo}

                  />
                </Box>


              </Stack>

              <Stack direction="row" spacing={3} mt={3}>


                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="email">
                    Email Address
                    <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span>
                  </CustomFormLabel>
                  <CustomTextField
                    disabled
                    variant="outlined" fullWidth
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}

                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="password">
                    Password
                    <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span>
                  </CustomFormLabel>
                  <CustomPasswordField
                    variant="outlined" fullWidth
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}

                  />
                </Box>

                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="confirmPassword">
                    Confirm Password
                    <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span>
                  </CustomFormLabel>
                  <CustomPasswordField
                    variant="outlined" fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}

                  />
                </Box>

              </Stack>

              <Stack direction="row" spacing={3} mt={3} sx={{ width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="email">
                    Country
                    <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span>
                  </CustomFormLabel>
                  <CountrySelect countries={countries} formik={formik} />
                </Box>

                <Box sx={{ width: '100%', opacity: !formik.values.countryId ? '.5' : null }}>
                  <CustomFormLabel htmlFor="contactNo">
                    Contact No
                    <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span>
                  </CustomFormLabel>
                  <CustomTextField
                    type='tel'
                    variant="outlined"
                    fullWidth
                    id="contactNo"
                    name="contactNo"
                    value={formik.values.contactNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                    helperText={formik.touched.contactNo && formik.errors.contactNo}
                    disabled={!formik.values.countryId}
                    inputProps={{
                      style: {
                        padding: '12px 14px',
                        paddingLeft: 0
                      }
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">
                        <span className='text-zinc-700 font-semibold border-r border-zinc-300 pr-2'>
                          +{formik.values.countryId?.phoneCode}
                        </span>
                      </InputAdornment>,
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="cnicNo">
                    National Id
                    {/* <span style={{ color: "red", fontSize: "15px" }}>
                      *
                    </span> */}
                  </CustomFormLabel>
                  <CustomTextField
                    type='number'
                    variant="outlined" fullWidth
                    id="cnicNo"
                    name="cnicNo"
                    value={formik.values.cnicNo}
                    onChange={formik.handleChange}
                    error={formik.touched.cnicNo && Boolean(formik.errors.cnicNo)}
                    helperText={formik.touched.cnicNo && formik.errors.cnicNo}

                  />
                </Box>



              </Stack>
            </Stack>
            <Stack alignItems={'end'} sx={{ mt: '20px' }}>
              <LoadingButton
                type='submit'
                loading={formSubmitting}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
              >
                Save
              </LoadingButton>
            </Stack>


          </form>
        </Fade>
      }
    </PageContainer>
  );
};

export default UserProfile;
