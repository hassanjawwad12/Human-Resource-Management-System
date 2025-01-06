import React, { useEffect } from 'react';
import { IconButton, Box, Stack, Typography, TextField, Tooltip, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Scrollbar from '../../custom-scroll/Scrollbar';
import {
  fetchNotes,
  SelectNote,
  DeleteNote,
  SearchNotes,
} from '../../../store/apps/notes/NotesSlice';
import { IconTrash } from '@tabler/icons';

const NoteList = () => {
  const dispatch = useDispatch();
  const activeNote = useSelector((state) => state.notesReducer.notesContent);
  const searchTerm = useSelector((state) => state.notesReducer.noteSearch);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const filterNotes = (notes, nSearch) => {
    if (nSearch !== '')
      return notes.filter(
        (t) =>
          !t.deleted &&
          t.title.toLocaleLowerCase().concat(' ').includes(nSearch.toLocaleLowerCase()),
      );

    return notes.filter((t) => !t.deleted);
  };

  const notes = useSelector((state) =>
    filterNotes(state.notesReducer.notes, state.notesReducer.noteSearch),
  );

  return (
    <>
      <Box p={3} px={2}>
        <TextField
          id="search"
          value={searchTerm}
          placeholder="Search Notes"
          inputProps={{ 'aria-label': 'Search Notes' }}
          size="small"
          type="search"
          variant="outlined"
          fullWidth
          onChange={(e) => dispatch(SearchNotes(e.target.value))}
        />
        <Typography variant="h6" mb={0} mt={4} pl={1}>
          All Notes
        </Typography>
      </Box>
      <Box>
        <Scrollbar sx={{ height: { lg: 'calc(100vh - 300px)', sm: '100vh' }, maxHeight: '700px' }}>
          {notes && notes.length ? (
            notes.map((note) => (
              <Box key={note.id} px={2}>
                <Box
                  p={2}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    mb: 1,
                    transition: '0.1s ease-in',
                    transform: activeNote === note.id ? 'scale(1)' : 'scale(0.95)',
                    backgroundColor: `${note.color}.light`,
                  }}
                  onClick={() => dispatch(SelectNote(note.id))}
                >
                  <Typography variant="h6" noWrap color={note.color + '.main'}>
                    {note.title}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">
                      {new Date(note.datef).toLocaleDateString()}
                    </Typography>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => dispatch(DeleteNote(note.id))}
                      >
                        <IconTrash width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Box>
            ))
          ) : (
            <Box m={2}>
              <Alert severity="error" variant="filled" sx={{ color: 'white' }}>
                No Notes Found!
              </Alert>
            </Box>
          )}
        </Scrollbar>
      </Box>
    </>
  );
};

export default NoteList;
