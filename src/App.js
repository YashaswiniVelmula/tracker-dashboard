import "./App.css";
import MapComponent from "./components/MapComponents";
import AddressSearch from "./components/AddressSearch";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { gql, useLazyQuery, useSubscription } from "@apollo/client";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const getSubscriptionQuery = gql`
  subscription GetRecordsSubscription($userID: ID!) {
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

  useSubscription(getSubscriptionQuery, {
    variables: { userID },
    onData: (subscriptionData) => {
      if (subscriptionData?.data?.data?.recordInRadius?.records) {
        setMarkers((prevRecords) => [
          ...prevRecords,
          ...subscriptionData?.data?.data?.recordInRadius?.records,
        ]);
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
    if (searching && numOfResponses === 2) {
      setSearching(false);
      setShowSpinner(false);
      setNumOfResponses(0);
    }
  }, [numOfResponses, searching, subscription]);

  const handleSearchClick = () => {
    if (
      prevLat.current === lat &&
      prevLong.current === long &&
      prevRadius.current === radius
    ) {
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
        userID,
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
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            ></IconButton>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              {/* <StyledInputBase
                placeholder="Search Address"
                inputProps={{ "aria-label": "search" }}
              /> */}
              <AddressSearch
                //   className="search-address"
                setLatValue={setLat}
                setLongValue={setLong}
              />
            </Search>

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
          </Toolbar>
        </AppBar>
      </Box>
      <MapComponent markers={markers} />
    </>
  );
}

export default App;
