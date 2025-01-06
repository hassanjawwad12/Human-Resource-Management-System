import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Check as IconCheck } from '@mui/icons-material';

const HolidayDialog = ({
  open,
  handleClose,
  title,
  start,
  end,
  color,
  remarks,
  setTitle,
  setStart,
  setEnd,
  setColor,
  setRemarks,
  submitHandler,
  ColorVariation,
  handleEventDelete,
}) => {
  console.log(end);
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
        },
      }}
    >
      <form onSubmit={submitHandler}>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Stack direction="column">
            <Typography variant="h5" className="text-white">
              {title === '' ? 'New Holiday' : 'Edit Holiday'}
            </Typography>
            <Typography variant="subtitle1" className="text-white">{`${start.format(
              'DD MMM YYYY',
            )} - ${end.format('DD MMM YYYY')}`}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mb: 2 }}>
          <Stack direction="column" gap={2} pt={2}>
            <TextField
              id="Holiday Title"
              placeholder="Enter Holiday Title"
              variant="outlined"
              fullWidth
              label="Holiday Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Start Date"
                value={start}
                onChange={(newValue) => setStart(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DesktopDatePicker
                label="End Date"
                value={end}
                onChange={(newValue) => setEnd(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <TextField
              id="Remarks"
              placeholder="Enter Remarks"
              variant="outlined"
              fullWidth
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <Typography variant="h6" fontWeight={600}>
              Select Holiday Color
            </Typography>
            <Box>
              {ColorVariation.map((mcolor) => (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor }}
                  sx={{
                    marginRight: '3px',
                    transition: '0.1s ease-in',
                    scale: mcolor.value === color ? '0.9' : '0.7',
                  }}
                  size="small"
                  key={mcolor.id}
                  onClick={() => setColor(mcolor.value)}
                >
                  {mcolor.value === color ? <IconCheck width={16} /> : ''}
                </Fab>
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
            >
              Cancel
            </Button>
            <Button onClick={handleEventDelete} color="error">
              Delete
            </Button>
            <Button type="submit" disabled={!title} variant="contained">
              {title ? 'Update' : 'Add'} Holiday
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HolidayDialog;
