import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';

export default function ImportEmployeesCsv({ open, onClose }) {
    const [file, setFile] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_DOMAIN;

    const handleDownload = (event) => {
        // event.preventDefault();
        // const url = `${BASE_URL}/templates/Employees Data.xlsx`;
        // console.log(url)
        // window.open(url, '_blank');
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        const fileName = droppedFile.name.toLowerCase();
        const fileExtension = fileName.split('.').pop();

        const allowedExtensions = ['csv', 'xls', 'xlsx', 'xlsm', 'xlsb', 'xltx', 'xltm', 'xlt'];

        if (allowedExtensions.includes(fileExtension)) {
            setFile(droppedFile);
        } else {
            alert("Please drop a CSV or Excel file.");
        }
    };

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleStartImport = () => {
        // Implement import logic
        console.log("Starting import with file:", file);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '16px'
                }
            }}
        >
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
                Bulk Employee Import
            </DialogTitle>

            <DialogContent sx={{ my: 2 }}>
                <Typography variant="body1" gutterBottom>
                    Follow these steps to import employees:
                </Typography>

                <List>


                    <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon><DownloadIcon color="primary" /></ListItemIcon>
                        <ListItemText
                            primary="1. Download the CSV template"
                            sx={{ flex: 'none', marginRight: 2 }}
                        />
                        <Button
                            href="http://35.179.98.1/Employees Data.xlsx"
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            size="small"
                            sx={{ color: 'primary.main', bgcolor: '#fff !important' }}
                        >
                            Download Template
                        </Button>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
                        <ListItemText
                            primary="2. Fill in the template with all the required fields"
                        // secondary="Ensure all required fields are completed. The template includes: Name, Email, Department, and Job Title."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><CloudUploadIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="3. Upload your completed CSV file" />
                    </ListItem>
                </List>

                <Box
                    sx={{
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '#f0f0f0'
                        }
                    }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Drag and Drop CSV Here
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        or Click to Select File
                    </Typography>
                    <input
                        id="file-input"
                        type="file"
                        hidden
                        accept=".csv, .xls, .xlsx, .xlsm, .xlsb, .xltx, .xltm, .xlt"
                        onChange={handleFileSelect}
                    />
                </Box>

                {file && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Selected file: {file.name}
                    </Typography>
                )}

                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Note: Please ensure your CSV file matches the template format to avoid import errors.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
                    <Button sx={{ color: 'primary.main', bgcolor: '#fff !important' }} variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleStartImport}
                        disabled={!file}
                    >
                        Import
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}