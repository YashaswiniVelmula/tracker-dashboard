import "./App.css";
import MapComponent from "./components/MapComponents";
import AddressSearch from "./components/AddressSearch";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { gql, useLazyQuery, useSubscription } from "@apollo/client";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import CircularProgress from '@mui/material/CircularProgress';

const getSubscriptionQuery = gql`
  subscription GetRecordsSubscription ($userID: ID!)  {
    recordInRadius(userID: $userID) {
        records {
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
        userID
      }
  }
`;

const getQuery = gql`
  query GetRecordsQuery(
    $latitude: Float!
    $longitude: Float!
    $radiusInMiles: Float!
    $userID: ID!
  ) {
    getRecordsInRadius(
      latitude: $latitude
      longitude: $longitude
      radiusInMiles: $radiusInMiles
      userID: $userID
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
  const [userID] = useState(uuidv4());
  const [numOfResponses, setNumOfResponses] = useState(0);
  const [searching, setSearching] = useState(false);

  const subscription = useSubscription(getSubscriptionQuery, {
    variables: {userID},
    onData: (subscriptionData) => {
      if (subscriptionData?.data?.data?.recordInRadius?.records) {
        setNumOfResponses((prev) => prev+1);
        setMarkers(prevRecords => [...prevRecords, ...subscriptionData?.data?.data?.recordInRadius?.records]);
      }
    },
  });

  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [radius, setRadius] = useState(5);
  const [showSpinner, setShowSpinner] = useState(false);

  const prevLat = useRef(lat);
  const prevLong = useRef(long);
  const prevRadius = useRef(radius);

  useEffect(() => {
    if(searching && numOfResponses === 2) {
        setSearching(false);
        setShowSpinner(false);
        setNumOfResponses(0);
    }
  }, [numOfResponses, searching, subscription]);

  const handleSearchClick = () => {
    if (prevLat.current === lat && prevLong.current === long && prevRadius.current === radius) {
        return;
      }
  
    prevLat.current = lat;
    prevLong.current = long;
    prevRadius.current = radius;
    setMarkers([]);
    setSearching(true);
    setNumOfResponses(0);
    setShowSpinner(true);
    getRecordsLazyQuery({
      variables: {
        latitude: lat,
        longitude: long,
        radiusInMiles: radius,
        userID
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
    {
        value: 50,
        label: "50",
    },
  ];
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr 1fr 1fr",
          gap: "1rem",
          margin: "1rem 0 1rem 0",
          alignItems: "center"
        }}
      >
        <AddressSearch
        //   className="search-address"
          setLatValue={setLat}
          setLongValue={setLong}
          isDisabled={showSpinner}
        />
        <TextField
          className="radius-button"
          id="outlined-select-currency"
          select
          size="small"
          label="Select radius in Miles"
          defaultValue="5"
          onChange={(event) => setRadius(event.target.value)}
          disabled={showSpinner}
        >
          {radiusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          className="search-button"
          onClick={handleSearchClick}
        >
          Search
        </Button>
        {showSpinner && <CircularProgress />}
      </div>
      <MapComponent markers={markers} />
    </>
  );
}

export default App;
