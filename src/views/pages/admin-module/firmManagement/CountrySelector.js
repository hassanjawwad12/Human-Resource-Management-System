import * as React from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';

export default function CountrySelect({ countries, formik }) {
   
    React.useEffect(() => {
        const defaultCountry = countries.find(country => country.label === "Pakistan");
        if (defaultCountry && !formik.values.countryId) {
            formik.setFieldValue("countryId", defaultCountry);
        }
    }, [countries, formik]);

    return (
        <Autocomplete
            value={formik.values.countryId || null}
            id="countryId"
            name="countryId"
            onChange={(event, value) => {
                formik.setFieldValue("countryId", value);
            }}
            options={countries}
            sx={{ padding: '0 !important' }}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.shortLabel.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.shortLabel.toLowerCase()}.png`}
                        alt=""
                    />
                    {option.label} ({option.shortLabel})
                </Box>
            )}
            renderInput={(params) => (
                <CustomTextField
                    {...params}
                    size='small'
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                        style: {
                            height: "27.5px",
                        },
                    }}
                />
            )}
        />
    );
}
