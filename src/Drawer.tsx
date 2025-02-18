import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { getCountryInfo } from '../api/api.ts';

export default function TemporaryDrawer() {
    const [countries, setCountries] = useState<{ name: string; alpha3code: string }[]>([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getCountryInfo();
            setCountries(data);
        }

        fetchData();
    }, []);

    const DrawerList = (
        <Box sx={{ width: 250 }}>
            <List>
                {countries.map((country) => (
                    <ListItem key={country.alpha3code} disablePadding>
                        <ListItemButton>
                            <ListItemText primary={country.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer open>{DrawerList}</Drawer>
        </div>
    );
}