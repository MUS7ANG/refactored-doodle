import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { getCountryInfo, Country, CountryInfo } from '../../../api/api.ts'


export default function CountryInfoPanel() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
    const [borderCountries, setBorderCountries] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getCountryInfo();
            setCountries(data);
        }
        fetchData();
    }, []);

    const fetchCountryDetails = async (alpha3code: string) => {
        try {
            const response = await fetch(`https://restcountries.com/v2/alpha/${alpha3code}`);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            const data: CountryInfo = await response.json();
            setSelectedCountry(data);

            if (data.borders && data.borders.length > 0) {
                const borderNames = await Promise.all(
                    data.borders.map(async (code) => {
                        const borderResponse = await fetch(`https://restcountries.com/v2/alpha/${code}`);
                        const borderData: CountryInfo = await borderResponse.json();
                        return borderData.name;
                    })
                );
                setBorderCountries(borderNames);
            } else {
                setBorderCountries([]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных о стране:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Paper elevation={3} sx={{ width: 250, overflowY: 'auto' }}>
                <List>
                    {countries.map((country) => (
                        <ListItem key={country.alpha3code} disablePadding>
                            <ListItemButton
                                onClick={() => fetchCountryDetails(country.alpha3code)}
                                selected={selectedCountry?.name === country.name}
                            >
                                <ListItemText primary={country.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Box sx={{ flex: 1, p: 3 }}>
                {selectedCountry ? (
                    <>
                        <Typography variant="h4" gutterBottom>
                            {selectedCountry.name}
                        </Typography>

                        {selectedCountry.flags?.svg && (
                            <img
                                src={selectedCountry.flags.svg}
                                alt={selectedCountry.name}
                                width={150}
                                style={{ display: 'block', marginBottom: '10px' }}
                            />
                        )}

                        <Typography variant="body1">
                            <strong>Region:</strong> {selectedCountry.region}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Population:</strong> {selectedCountry.population.toLocaleString()}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Borders with:</Typography>
                        {borderCountries.length > 0 ? (
                            <List>
                                {borderCountries.map((border, index) => (
                                    <ListItem key={index} sx={{ pl: 2 }}>
                                        • {border}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2">No border countries</Typography>
                        )}
                    </>
                ) : (
                    <Typography variant="h6" color="textSecondary">
                        Select a country to see details
                    </Typography>
                )}
            </Box>
        </Box>
    );
}