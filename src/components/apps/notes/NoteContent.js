import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Divider,
  Fab,
  TextField,
  FormLabel,
  useTheme,
  IconButton,
  Typography,
} from '@mui/material';
import { IconCheck, IconMenu2 } from '@tabler/icons';

import { UpdateNote } from '../../../store/apps/notes/NotesSlice';
import AddNotes from './AddNotes';

const NoteContent = ({ toggleNoteSidebar }) => {
  const noteDetails = useSelector(
    (state) => state.notesReducer.notes[state.notesReducer.notesContent - 1],
  );
  const theme = useTheme();

  const dispatch = useDispatch();

  const colorvariation = [
    {
      id: 1,
      lineColor: theme.palette.warning.main,
      disp: 'warning',
    },
    {
      id: 2,
      lineColor: theme.palette.info.main,
      disp: 'info',
    },
    {
      id: 3,
      lineColor: theme.palette.error.main,
      disp: 'error',
    },
    {
      id: 4,
      lineColor: theme.palette.success.main,
      disp: 'success',
    },
    {
      id: 5,
      lineColor: theme.palette.primary.main,
      disp: 'primary',
    },
  ];

  return (
    <Box sx={{ height: { lg: 'calc(100vh - 250px)', sm: '100vh' }, maxHeight: '700px' }}>
      {/* ------------------------------------------- */}
      {/* Header Part */}
      {/* ------------------------------------------- */}
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <IconButton onClick={toggleNoteSidebar}>
          <IconMenu2 stroke={1.5} />
        </IconButton>
        <AddNotes colors={colorvariation} />
      </Box>
      <Divider />
      {/* ------------------------------------------- */}
      {/* Edit notes */}
      {/* ------------------------------------------- */}
      {noteDetails && noteDetails.deleted === false ? (
        <Box p={3}>
          <FormLabel htmlFor="outlined-multiline-static">
            <Typography variant="h6" mb={2} fontWeight={600} color="text.primary">
              Edit Note
            </Typography>
          </FormLabel>

          <TextField
            id="outlined-multiline-static"
            placeholder="Edit Note"
            multiline
            fullWidth
            rows={5}
            variant="outlined"
            value={noteDetails.title}
            onChange={(e) => dispatch(UpdateNote(noteDetails.id, 'title', e.target.value))}
          />
          <br />
          <Typography variant="h6" mt={3} mb={2} fontWeight={600}>
            Change Note Color
          </Typography>

          {colorvariation.map((color1) => (
            <Fab
              sx={{
                marginRight: '3px',
                boxShadow: 'none',
                transition: '0.1s ease-in',
                scale: noteDetails.color === color1.disp ? '0.9' : '0.7',
              }}
              size="small"
              key={color1.id}
              color={color1?.disp}
              onClick={() => dispatch(UpdateNote(noteDetails.id, 'color', color1.disp))}
            >
              {noteDetails.color === color1.disp ? <IconCheck width="16" /> : ''}
            </Fab>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', fontSize: '24px', mt: 2 }}>Select a Note</Box>
      )}
    </Box>
  );
};

export default NoteContent;
