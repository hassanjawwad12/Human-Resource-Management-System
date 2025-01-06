import React from 'react';
import { Typography, Button, Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';

import { IconUser, IconPlus } from "@tabler/icons";


const emails = ['JohnDeo@gmail.com', 'SmithRocky@gmail.com'];

const SimpleDialog = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(emails[1]);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    return (
        <>
            
            <Button variant="contained" color="primary" fullWidth onClick={handleClickOpen}>
                Open Simple Dialog
            </Button>
            <Typography variant="subtitle1" component="div" mb={1} textAlign="center">
                Selected: {selectedValue}
            </Typography>
            <Dialog  onClose={() => handleClose(selectedValue)} open={open}>
                <DialogTitle>Set backup account</DialogTitle>
                <List sx={{ pt: 0 }}>
                    {emails.map((email) => (
                        <ListItem button onClick={() => handleClose(email)} key={email}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                                    <IconUser widht={20} height={20} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={email} />
                        </ListItem>
                    ))}

                    <ListItem autoFocus button onClick={() => handleClose('addAccount')}>
                        <ListItemAvatar>
                            <Avatar>
                                <IconPlus width={20} height={20} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add account" />
                    </ListItem>
                </List>
            </Dialog>
        </>
    );
}

export default SimpleDialog;
