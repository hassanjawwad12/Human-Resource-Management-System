import React, { useEffect, useState } from 'react';
import { Box, Button,  Skeleton, Fade } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import {
  getAllCountries,
  getCompany,
  saveFirm,
} from '../../../../store/admin/FirmSlice';
import CountrySelect from './CountrySelector';
import { InputAdornment } from '@mui/material';
import { PhoneNumberUtil } from 'google-libphonenumber';
import UploadAvatar from '../../../apps/user-profile/UploadAvatar';
import { updateUserData } from '../../../../store/auth/login/LoginSlice';
import { updateProfileImageByUser } from '../../../../store/auth/userProfile/ProfileSlice';

const validationSchema = () =>
  yup.object({
    name: yup
      .string()
      .required('Organization Name is Required')
      .min(2, 'Too Short!')
      .max(20, 'Too Long!'),
    type: yup
      .string()
      .required('Business type is Required')
      .min(2, 'Too Short!')
      .max(20, 'Too Long!'),
    url: yup
      .string()
      .matches(
        /^(ftp|http|https):\/\/[^\s$.?#].[^\s]*\.[a-z]{2,}$/i,
        'Enter a valid URL with a proper domain',
      )
      .required('URL is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    countryId: yup.object().nullable().required('Country is Required'),
    contactNo: yup
      .string()
      .required('Contact number is Required')
      .test('is-phone-valid', 'Phone number is not valid', function (value) {
        const { countryId } = this?.parent;
        return countryId ? isPhoneValid(value, countryId) : false;
      }),
  });
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone, countryId) => {
  const fullNumber = '+' + countryId?.phoneCode + phone;
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(fullNumber));
  } catch (error) {
    return false;
  }
};

const FirmManagement = () => {
  const { user } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { firmData, allFirmData } = useSelector((state) => state.firmReducer);
  const [loading, setLoading] = useState(true);
  const [avatarData, setAvatarData] = React.useState({
    preview:
      user.profileFileName ||
      `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${user.targetFileName}`,
    file: null,
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const [countryList, setCountryList] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      url: '',
      address: '',
      city: '',
      countryId: null, //stores an object at first, then i will get its id through it later
      contactNo: '',
      firmId: user.firmId || '0',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let formdata = new FormData();

      for (const key in values) {
        // Append the country ID instead of the name
        if (key === 'countryId') {
          formdata.append(key, values[key].id);
        } else {
          formdata.append(key, values[key]);
        }
      }
      let formDataImg = new FormData();

      formDataImg.append('file', avatarData.file);
      formDataImg.append('userId', user.id);

      dispatch(
        updateUserData({
          ...user,
          profileFileName: avatarData.preview,
        }),
      );

      dispatch(updateProfileImageByUser(formDataImg))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            // setAlert({
            //   open: true,
            //   severity: 'success',
            //   message: result.payload.USER_MESSAGE
            // })
          } else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
          });
        });

      dispatch(saveFirm(formdata))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE,
            });

            navigate(`/admin/addSchedule/${result.payload.DATA.id}`);
          } else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
          });
        });
    },
  });

  useEffect(() => {
    fetchAndSetUserData();
  }, []);

  function setFirmData(firmData, countryList) {
    if (firmData?.id) {
      formik.setValues({
        ...formik.values,
        name: firmData?.name,
        type: firmData?.type,
        url: firmData?.url,
        address: firmData?.address,
        countryId: countryList.find((a) => a.id === firmData.countryId),
        city: firmData?.city,
        contactNo: firmData?.contactNo,
        firmId: firmData?.id,
      });
      dispatch(
        updateUserData({
          ...user,
          firmId: firmData?.id,
          companyId: firmData?.id,
        }),
      );
    }
    setLoading(false);
  }

  const isValid = isPhoneValid(formik.values?.contactNo, formik.values.countryId);

  const fetchAndSetUserData = () => {
    //made this temp variable just to pass the latest country call data to setFirmData function
    let allCountries = [];
    dispatch(getAllCountries())
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          allCountries = [...result.payload.DATA];
          setCountryList(allCountries);
          return dispatch(getCompany());
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .then((result2) => {
        console.log(result2, 'result');
        if (result2.payload.SUCCESS === 1) {
          setFirmData(result2.payload.DATA, allCountries);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result2.payload,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert({
          open: true,
          severity: 'error',
          message: error.USER_MESSAGE || 'Something went wrong.',
        });
      });
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create a URL for preview
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const BCrumb = [
    {
      to: '/admin',
      title: 'Admin',
    },
    {
      title: 'Firm Management',
    },
  ];

  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />

      {/* <Breadcrumb title="Firm Management" items={BCrumb} /> */}

      {/* <CustomBackdrop loading={loading} /> */}

      {loading ? (
        <Box mt={5}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
              <Stack direction="row" alignItems="center">
                <Skeleton variant="circular" width={100} height={100} />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={3}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ width: '100%' }}>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="rounded" height={46} />
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={3}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ width: '100%' }}>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="rounded" height={46} />
                </Box>
              ))}
            </Stack>

            <Box>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="rounded" height={46} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Skeleton variant="rounded" width={100} height={36} />
            </Box>
          </Stack>
        </Box>
      ) : (
        <Fade in>
          <form onSubmit={formik.handleSubmit}>
            {/* <Typography color="primary" variant="h5" mb={1} >
                        Set Firm Details
                    </Typography> */}
            <Box>
              <Stack>
                <UploadAvatar avatarData={avatarData} setAvatarData={setAvatarData} />
                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="name">
                      Firm Name
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      sx={{ width: '100%' }}
                      id="name"
                      variant="outlined"
                      fullWidth
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="type">
                      Firm Type
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      sx={{ width: '100%' }}
                      id="type"
                      variant="outlined"
                      fullWidth
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      error={formik.touched.type && Boolean(formik.errors.type)}
                      helperText={formik.touched.type && formik.errors.type}
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="url">
                      Firm URL
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      sx={{ width: '100%' }}
                      id="url"
                      variant="outlined"
                      fullWidth
                      name="url"
                      value={formik.values.url}
                      onChange={formik.handleChange}
                      error={formik.touched.url && Boolean(formik.errors.url)}
                      helperText={formik.touched.url && formik.errors.url}
                    />
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '100%' }}>
                    <CustomFormLabel htmlFor="countryId">
                      Select Country
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CountrySelect
                      countries={countryList?.length > 0 ? countryList : []}
                      formik={formik}
                    />

                    <span style={{ color: '#FA896B', fontSize: '0.75rem' }}>
                      {formik.touched.countryId && formik.errors.countryId}
                    </span>
                  </Box>
                  <Box sx={{ width: '100%', opacity: !formik.values.countryId ? '.5' : null }}>
                    <CustomFormLabel htmlFor="city">
                      City
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="city"
                      variant="outlined"
                      fullWidth
                      name="city"
                      disabled={!formik.values.countryId}
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                    />
                  </Box>

                  <Box sx={{ width: '100%', opacity: !formik.values.countryId ? '.5' : null }}>
                    <CustomFormLabel htmlFor="contactNo">
                      Contact Number
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      value={formik.values.contactNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                      helperText={formik.touched.contactNo && formik.errors.contactNo}
                      id="contactNo"
                      name="contactNo"
                      variant="outlined"
                      fullWidth
                      type="tel"
                      inputProps={{
                        style: {
                          padding: '12px 14px',
                          paddingLeft: 0,
                        },
                      }}
                      disabled={!formik.values.countryId}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span className="text-zinc-700 font-semibold border-r border-zinc-300 pr-2">
                              +{formik.values.countryId?.phoneCode}
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>
              </Stack>

              <CustomFormLabel htmlFor="address">
                Address
                <span style={{ color: 'red', fontSize: '15px' }}>*</span>
              </CustomFormLabel>
              <Box mb={4}>
                <CustomTextField
                  id="address"
                  variant="outlined"
                  fullWidth
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Box>
              <Stack direction="row" justifyContent="end">
                <Button color="primary" variant="contained" type="submit">
                  Next
                </Button>
              </Stack>
            </Box>
          </form>
        </Fade>
      )}
    </>
  );
};

export default FirmManagement;
