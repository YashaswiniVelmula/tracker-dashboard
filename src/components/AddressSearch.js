import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import InputBase from "@mui/material/InputBase";

const AddressSearch = ({ setLatValue, setLongValue, isDisabled }) => {
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
    // <div>
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ position: "relative" }}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            {...getInputProps({ placeholder: " Search Address..." })}
            inputProps={{ "aria-label": "search google maps" }}
            className="search-address"
            style={{
              width: "100%",
              border: "1px solid #D3D3D3",
              padding: "0.2rem",
              borderRadius: "0.3rem",
              margin: "0",
              backgroundColor: "white",
            }}
            disabled={isDisabled}
          />
          <div
            style={{
              position: "absolute",
              display: suggestions.length === 0 && "none",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: "#fff",
              border: "1px solid #D3D3D3",
              borderRadius: "0.3rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {loading ? <div>Loading...</div> : null}

            {suggestions.map((suggestion) => {
              const style = {
                backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                color: "black",
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
    // </div>
  );
};

export default AddressSearch;
