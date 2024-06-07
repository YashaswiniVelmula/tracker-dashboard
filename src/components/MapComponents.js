import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 38.6270,
  lng: -90.1994,
};

const libraries = ["places"];

const MapComponent = ({ markers }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDyZ2be-CfnBxmBPd8bIdfG8XRhTgb8bh4", // Replace with your API key
    libraries,
    // Add 'async' option to load the script asynchronously
    async: true,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;
  return (
    <div className="map-container">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={ (markers.length > 0 ? {
        lat: markers[0]?.address?.latitude,
        lng: markers[0]?.address?.longitude
      } : center)} zoom={8}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{
              lat: marker.address.latitude,
              lng: marker.address.longitude,
            }}
            onClick={() => {
              setSelectedMarker(marker);
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.address.latitude,
              lng: selectedMarker.address.longitude,
            }}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div>
              <h3>
                {selectedMarker.firstName} {selectedMarker.lastName}
              </h3>
              <p>Age: {selectedMarker.age}</p>
              <p>Date of Birth: {selectedMarker.dob}</p>
              <p>Case Type: {selectedMarker.caseDetail.type}</p>
              <p>Case Date: {selectedMarker.caseDetail.date}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
