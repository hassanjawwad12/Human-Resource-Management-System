import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Paper } from '@mui/material';

import { IconInbox, IconMailOpened } from "@tabler/icons";

const SimpleList = () => {
    return (
        <>
            <Paper variant="outlined">
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <IconInbox width={20} height={20} />
                            </ListItemIcon>
                            <ListItemText primary="Inbox" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <IconMailOpened width={20} height={20} />
                            </ListItemIcon>
                            <ListItemText primary="Drafts" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Trash" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#simple-list">
                            <ListItemText primary="Spam" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Paper>
        </>
    );
}

export default SimpleList;
