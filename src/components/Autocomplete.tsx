import { useEffect, useRef } from 'react';
import { Country } from '../ts/interfaces/Country.interface';
import useAutocomplete from '../hooks/useAutocomplete';

interface Props {
  data: Country[];
}

const Autocomplete = ({ data }: Props) => {
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.focus();
    }
  }, []);

  const {
    searchedValue,
    suggestions,
    selectedSuggestion,
    activeSuggestion,
    handleChange,
    handleKeyDown,
    handleClick,
  } = useAutocomplete(data, inputSearchRef.current);

  return (
    <div className='wrapper'>
      <input
        className='autocomplete-input'
        placeholder='Search your Country'
        value={searchedValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={inputSearchRef}
      />

      <ul className='autocomplete-results'>
        {!suggestions.length &&
        searchedValue.length &&
        !selectedSuggestion.length ? (
          <div className='notfound'>No results found</div>
        ) : (
          <>
            {suggestions.map(({ name, flags }: Country, index) => (
              <li
                key={index}
                className={`${
                  index === activeSuggestion - 1 ? 'activeItem' : ''
                }`}
                onClick={() => handleClick(name.common)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img className='flags' src={flags.svg} alt='flag' />
                  <div style={{ marginLeft: '8px' }}>{name.common}</div>
                </div>
              </li>
            ))}
          </>
        )}
      </ul>
      <div className='countrySelected'>
        <p>Country selected: {selectedSuggestion}</p>
      </div>
    </div>
  );
};

export default Autocomplete;
