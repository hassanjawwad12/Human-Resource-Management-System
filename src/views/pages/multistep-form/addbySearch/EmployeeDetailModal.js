import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Divider } from "@mui/material";
import Scrollbar from "../../../../components/custom-scroll/Scrollbar";
import dayjs from 'dayjs'
export default function EmployeeDetailModal({ open, setOpen, candidate, Comp }) {

    console.log(candidate)
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={'md'}
            onClose={() => setOpen(false)}
        >
            {/* <DialogTitle id="alert-dialog-title" variant="h5" sx={{ color: 'primary.main' }}>
                {'Employee detail'}
            </DialogTitle> */}
            <DialogContent sx={{ position: 'relative' }}>

                <Box className='absolute top-0 right-0 left-0 h-[5rem] w-full rounded-none opacity-90' sx={{ background: 'primary.main', borderRadius: 0 }}>

                </Box>
                <Box sx={{ position: 'relative', zIndex: '100', mb: 3 }}>
                    <Typography variant="h4" fontWeight={700} color={'white'}>{candidate?.fullName}</Typography>
                    <Typography variant="p" sx={{ display: 'block', color: 'white' }} mt={.5} mb={1} >{candidate?.occupation || 'null'}</Typography>

                </Box>


                <Box className='flex items-center gap-5 relative z-10 mt-3'>
                    <div className='w-[120px] h-[120px]  flex overflow-hidden drop-shadow-m'>
                        <img className='object-cover h-full w-full' src={candidate?.profileImage} />
                    </div>
                    <Divider flexItem orientation="vertical" variant="middle" sx={{ mx: 2 }} />
                    <Box className='grid grid-cols-3 gap-x-[3rem] gap-y-[1rem]'>
                        <Stack mb={1} direction="column">
                            <Typography variant='subtitle1' fontSize={'.7rem'}>Name:</Typography>
                            <Typography fontWeight={700}>{candidate?.fullName}</Typography>
                        </Stack>

                        <Stack mb={1} direction="column">
                            <Typography variant='subtitle1' fontSize={'.7rem'}>Email:</Typography>
                            <Typography fontWeight={700}>{candidate?.email || 'work@email.com'}</Typography>
                        </Stack>
                        <Stack mb={1} direction="column" >
                            <Typography variant='subtitle1' fontSize={'.7rem'}>Contact:</Typography>
                            <Typography fontWeight={700}>{candidate?.contactNo || '232333211'}</Typography>
                        </Stack>
                        <Stack mb={1} direction="column" >
                            <Typography variant='subtitle1' fontSize={'.7rem'}>National ID:</Typography>
                            <Typography fontWeight={700}>{candidate?.cnicNo || '34201-3123-1'}</Typography>
                        </Stack>
                        {/* <Stack mb={1} direction="column" >
                            <Typography variant='subtitle1' fontSize={'.7rem'}>Working Days:</Typography>
                            <Typography fontWeight={700}>
                                {`${dayjs(candidate.startTime.join(':'), 'HH:mm').format('hh:mmA')}
                             to 
                            ${dayjs(candidate.endTime.join(':'), 'HH:mm').format('hh:mmA')}`}
                            </Typography>
                        </Stack> */}
                        {/* <Stack direction="column" >
                            <Typography variant='subtitle1' fontSize={'.7rem'}>Working Hours:</Typography>
                            <Typography fontWeight={700}>{`${candidate.startDate} to ${candidate.endDate}`}</Typography>
                        </Stack> */}
                    </Box>

                </Box>

                {<Comp />}
                <DialogActions sx={{ justifyContent: 'start' }} className='flex items-center justify-between '>
                    <Button onClick={() => setOpen(false)} variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>
                        Back
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog >
    )
}