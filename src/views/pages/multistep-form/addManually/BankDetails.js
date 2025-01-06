import { Box, Stack } from '@mui/system'
import React from 'react'
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField'
import CountrySelect from '../../admin-module/firmManagement/CountrySelector';
import { getAllCountries } from '../../../../store/admin/FirmSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
const BankDetails = ({ formik }) => {
  const [countryList, setCountryList] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllCountries())
      .then((result => {
        console.log(result, "result")
        if (result.payload.SUCCESS === 1) {
          setCountryList(result.payload.DATA)

        }
        else {
          // setAlert({
          //   open: true,
          //   severity: 'error',
          //   message: result.payload
          // })
        }
      }))
      .catch((error) => {
        setAlert({
          open: true,
          severity: 'error',
          message: error.USER_MESSAGE || 'Something went wrong.'
        })
      });
  }, [])
  return (
    <>
    
      <Stack direction="row" spacing={3}>
        <Box sx={{ width: "100%" }}>
          <CustomFormLabel htmlFor="countryId">
            Select Country
          </CustomFormLabel>
          <CountrySelect countries={countryList} formik={formik} />
        </Box>

        <Box sx={{ width: "100%" }}>
          <CustomFormLabel htmlFor="cnicNo">
            CNIC
            {/* <span style={{ color: "red", fontSize: "15px" }}>
              *
            </span> */}
          </CustomFormLabel>
          <CustomTextField id="cnicNo" variant="outlined" fullWidth
            inputProps={{ autoComplete: 'off' }}
            type='number'
            name="cnicNo"
            value={formik.values.cnicNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cnicNo && Boolean(formik.errors.cnicNo)}
            helperText={formik.touched.cnicNo && formik.errors.cnicNo}
          />
        </Box>
      </Stack>
      <Stack direction="row">
        <Box sx={{ width: "100%" }}>
          <CustomFormLabel htmlFor="bankAccountNo">
            Bank Account
            {/* <span style={{ color: "red", fontSize: "15px" }}>
              *
            </span> */}
          </CustomFormLabel>
          <CustomTextField id="bankAccountNo" variant="outlined" fullWidth
            multiline
            minRows={4}
            name="bankAccountNo"
            value={formik.values.bankAccountNo}
            onChange={formik.handleChange}
            error={formik.touched.bankAccountNo && Boolean(formik.errors.bankAccountNo)}
            helperText={formik.touched.bankAccountNo && formik.errors.bankAccountNo}
          />
        </Box>
      </Stack>
    </>
  )
}

export default BankDetails