interface Country {
    name: string;
    alpha3code: string;
    independent: boolean;
}

export const getCountryInfo = async (): Promise<Country[]> => {
    try {
        const response = await fetch('https://restcountries.com/v2/all?fields=alpha3Code,name');
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
    } catch (error) {
        console.error('Failed to fetch users:', error);
    return [];
    }
};

