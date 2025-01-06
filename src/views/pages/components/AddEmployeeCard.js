import { Card, CardContent, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'

const AddEmployeeCard = ({ title, icon, onClick }) => {
  return (
    <Card onClick={onClick} elevation={9} sx={{ width: '350px', cursor: 'pointer', borderRadius: '16px' }}>
      <CardContent>
        <Stack direction="row" spacing={2}>
          {icon}
          <Typography variant='h6'>
            {title}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AddEmployeeCard