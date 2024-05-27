import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import InputBase from "@mui/material/InputBase";

const AddressSearch = ({ setLatValue, setLongValue }) => {
  const [address, setAddress] = useState("");

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      setLatValue(latLng.lat);
      setLongValue(latLng.lng);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            {/* <input */}
            {/* {...getInputProps({ placeholder: 'Search Address' })} */}
            {/* /> */}
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              {...getInputProps({ placeholder: "Search Address" })}
              //   key={"searchInput"}
              inputProps={{ "aria-label": "search google maps" }}
              className="search-address"
              style={{  
                    // "&.MuiInputBase-input": {
                        width: "20rem",
                        border: "1px solid grey",
                    padding: "0.5rem",
                    borderRadius: "0.3rem"
                    // }
                    
                
              }}
            />
            <div>
              {loading ? <div>Loading...</div> : null}

              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                };

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, { style })}
                    key={suggestion.placeId}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default AddressSearch;
