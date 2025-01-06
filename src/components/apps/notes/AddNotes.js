import * as React from 'react';
import { addNote } from 'src/store/apps/notes/NotesSlice';
import {
  Button,
  Dialog,
  Fab,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
  Typography,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IconCheck } from '@tabler/icons';

const AddNotes = ({ colors }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [scolor, setScolor] = React.useState('primary');
  const id = useSelector((state) => state.notesReducer.notes.length + 1);
  const [title, setTitle] = React.useState('');

  const setColor = (e) => {
    setScolor(e);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" disableElevation color="primary" onClick={handleClickOpen}>
        Add Note
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography variant="h5" mb={2} fontWeight={700}>
            Add New Note
          </Typography>
          <DialogContentText>
            To add new notes please enter your description and choose note colors. and press the
            submit button to add new note.
          </DialogContentText>
          <TextField
            multiline
            rows={5}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            id="description"
            label="Add Note Description"
            type="text"
            fullWidth
            size="small"
            variant="outlined"
          />
          <Typography variant="h6" my={2}>
            Choose Color
          </Typography>
          {colors.map((color) => (
            <Fab
              color={color.disp}
              sx={{
                marginRight: '3px',
                transition: '0.1s ease-in',
                scale: scolor === color.disp ? '0.9' : '0.7',
              }}
              size="small"
              key={color.disp}
              onClick={() => setColor(color.disp)}
            >
              {scolor === color.disp ? <IconCheck /> : ''}
            </Fab>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={title === ''}
            onClick={(e) => {
              e.preventDefault();
              dispatch(addNote(id, title, scolor));
              setOpen(false);
              setTitle('');
            }}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddNotes;
