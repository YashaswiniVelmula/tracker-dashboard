import "./App.css";
import MapComponent from "./components/MapComponents";
import AddressSearch from "./components/AddressSearch";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { gql, useLazyQuery, useSubscription } from "@apollo/client";
import { useState } from "react";

const getSubscriptionQuery = gql`
  subscription GetRecordsSubscription {
    recordInRadius {
      address {
        latitude
        longitude
        location
      }
      firstName
      lastName
      age
      dob
      caseDetail {
        date
        type
      }
    }
  }
`;

const getQuery = gql`
  query GetRecordsQuery(
    $latitude: Float!
    $longitude: Float!
    $radiusInMiles: Float!
  ) {
    getRecordsInRadius(
      latitude: $latitude
      longitude: $longitude
      radiusInMiles: $radiusInMiles
    ) {
      firstName
      lastName
      age
      dob
    }
  }
`;

function App() {
  const [getRecordsLazyQuery] = useLazyQuery(getQuery);
  const [markers, setMarkers] = useState([]);

  useSubscription(getSubscriptionQuery, {
    onData: (subscriptionData) => {
        console.log("subsciption data", subscriptionData)
      if (subscriptionData?.data?.data?.recordInRadius) {
        setMarkers(prevRecords => [...prevRecords, ...subscriptionData?.data?.data?.recordInRadius]);
      }
    },
  });

  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [radius, setRadius] = useState(5);
  const handleSearchClick = () => {
    getRecordsLazyQuery({
      variables: {
        latitude: lat,
        longitude: long,
        radiusInMiles: radius,
      },
    });
  };
  const radiusOptions = [
    {
      value: 5,
      label: "5",
    },
    {
      value: 10,
      label: "10",
    },
    {
      value: 15,
      label: "15",
    },
    {
      value: 20,
      label: "20",
    },
  ];
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "1rem 0 1rem 0",
        }}
      >
        <AddressSearch
        //   className="search-address"
          setLatValue={setLat}
          setLongValue={setLong}
        />
        <TextField
          className="radius-button"
          id="outlined-select-currency"
          select
          size="small"
          label="Select radius"
          defaultValue="5"
          onChange={(event) => setRadius(event.target.value)}
        >
          {radiusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="search"
          className="search-button"
          onClick={handleSearchClick}
        >
          Search
        </Button>
      </div>
      <MapComponent markers={markers} />
    </>
  );
}

export default App;
