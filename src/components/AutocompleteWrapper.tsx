import { useEffect, useState } from 'react';
import Autocomplete from './Autocomplete';
import { Country } from '../ts/interfaces/Country.interface';

const AutocompleteWrapper = () => {
  const [data, setData] = useState<Country[]>([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/lang/eng');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='container'>
      <div className='title'>
        <h1>English-speaking countries:</h1>
      </div>
      <Autocomplete data={data} />
    </div>
  );
};

export default AutocompleteWrapper;
