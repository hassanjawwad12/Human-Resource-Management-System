import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper, ListSubheader } from '@mui/material';

import { IconWifi, IconBluetooth } from "@tabler/icons";

import CustomSwitch from "../../forms/theme-elements/CustomSwitch";

const SwitchList = () => {
    const [checked, setChecked] = React.useState(['wifi']);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <>
            <Paper variant="outlined">
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                    <ListItem>
                        <ListItemIcon>
                            <IconWifi width={20} height={20} />
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
                        <CustomSwitch
                            edge="end"
                            onChange={handleToggle('wifi')}
                            checked={checked.indexOf('wifi') !== -1}
                            inputProps={{
                                'aria-labelledby': 'switch-list-label-wifi',
                            }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <IconBluetooth width={20} height={20} />
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
                        <CustomSwitch
                            edge="end"
                            onChange={handleToggle('bluetooth')}
                            checked={checked.indexOf('bluetooth') !== -1}
                            inputProps={{
                                'aria-labelledby': 'switch-list-label-bluetooth',
                            }}
                        />
                    </ListItem>
                </List>
            </Paper>
        </>
    );
}

export default SwitchList;
