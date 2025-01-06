import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";


export default function EmployeeDetailCard({ candidate }) {
    return <Grid item xs={3}>
        <Card elevation={9} sx={{ p: 0 }}>
            <CardContent
                sx={{
                    height: '390px',
                    px: 2,
                    py: 1
                }}
            >
                <Stack mb={1} direction="row" alignItems='center' spacing={1}>
                    <Typography variant='subtitle1' fontWeight={700}>Name:</Typography>
                    <Typography>{candidate?.name}</Typography>
                </Stack>

                <Stack mb={1} direction="column" spacing={1}>
                    <Typography variant='subtitle1' fontWeight={700}>Email:</Typography>
                    <Typography>{candidate?.email}</Typography>
                </Stack>
                <Stack mb={1} direction="column" spacing={1}>
                    <Typography variant='subtitle1' fontWeight={700}>Contact:</Typography>
                    <Typography>{candidate?.contactNo}</Typography>
                </Stack>
                <Stack mb={1} direction="column" spacing={1}>
                    <Typography variant='subtitle1' fontWeight={700}>National ID:</Typography>
                    <Typography>{candidate?.cnicNo}</Typography>
                </Stack>
                <Stack mb={1} direction="column" spacing={1}>
                    <Typography variant='subtitle1' fontWeight={700}>Working Days:</Typography>
                    <Typography>{candidate?.workdayStart} {candidate.workdayStart && 'to'} {candidate?.workdayEnd}</Typography>
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Typography variant='subtitle1' fontWeight={700}>Working Hours:</Typography>
                    <Typography>{candidate?.worksFrom} {candidate.worksFrom && 'to'} {candidate?.worksTo}</Typography>
                </Stack>
            </CardContent>
        </Card>
    </Grid>
}