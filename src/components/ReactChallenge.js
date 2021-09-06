import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

const setNewLocationObject = (locationObject) => {
  let newLocationObject = {};
  Object.keys(locationObject).map((objectKey, index) => {
    if (typeof locationObject[objectKey] != "object") {
      Object.assign(newLocationObject, {
        [objectKey]: locationObject[objectKey],
      });
    } else {
      let nestedLocationObject = setNewLocationObject(
        locationObject[objectKey]
      );
      Object.keys(nestedLocationObject).map((nestedObjectKey) => {
        Object.assign(newLocationObject, {
          [nestedObjectKey]: nestedLocationObject[nestedObjectKey],
        });
      });
    }
  });

  return newLocationObject;
};

const useStyles = makeStyles((theme) => ({
  table: {
    padding: theme.spacing(3),
    margin: "auto",
  },
  searchButton: {
    paddingTop: theme.spacing(2),
  },
}));

const orderState = {
  DESC: "descending",
  ASC: "ascending",
  None: "none",
};

function ReactChallenge() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [userslocations, setUsersLocations] = useState([]);
  const [originalLocations, setOriginalLocations] = useState([]);
  const [userslocationsHeader, setUsersLocationsHeader] = useState([]);
  const [locationOrderHeader, setLocationOrderHeader] = useState({});
  const [search, setSearch] = useState("");
  const [dataIsLoading, setDataIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=20")
      .then((res) => {
        if (res.ok) return res.json();
        return res;
      })
      .then((res) => {
        serUsersLocation(res.results);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setDataIsLoading(false);
      });
  }, []);

  const serUsersLocation = (usersArray) => {
    let usersLocations = [];

    usersArray.map((userData) => {
      const userLocation = userData.location;
      usersLocations.push(setNewLocationObject(userLocation));
      return userData;
    });
    setUsersLocations(usersLocations);
    setOriginalLocations(usersLocations);
    setUsersLocationsHeader(Object.keys(usersLocations[0]));
    setHeaderOrderState(Object.keys(usersLocations[0]));
  };

  const setHeaderOrderState = (headerArray) => {
    let headerOrderState = {};
    headerArray.map((headerValue) => {
      Object.assign(headerOrderState, {
        [headerValue]: orderState.None,
      });
      return headerValue;
    });
    setLocationOrderHeader(headerOrderState);
  };

  function handleSorting(field) {
    const copy = [...userslocations];
    switch (locationOrderHeader[field]) {
      case orderState.None:
        setLocationOrderHeader({
          ...locationOrderHeader,
          [field]: orderState.ASC,
        });

        setUsersLocations(
          copy.sort(function (a, b) {
            if (a[field] < b[field]) {
              return -1;
            }
            if (a[field] > b[field]) {
              return 1;
            }
            return 0;
          })
        );

        break;
      case orderState.ASC:
        setLocationOrderHeader({
          ...locationOrderHeader,
          [field]: orderState.DESC,
        });

        setUsersLocations(
          copy.sort(function (a, b) {
            if (a[field] > b[field]) {
              return -1;
            }
            if (a[field] < b[field]) {
              return 1;
            }
            return 0;
          })
        );
        break;
      case orderState.DESC:
        setUsersLocations(originalLocations);
        setLocationOrderHeader({
          ...locationOrderHeader,
          [field]: orderState.None,
        });
        break;
      default:
        return null;
    }
  }

  const handleSearch = () => {
    if (search === "") {
      setUsersLocations(originalLocations);
    } else {
      const locations = [...userslocations];
      const newLocations = locations.filter((location) => {
        const concated = Object.values(location).join("").toLowerCase();
        return concated.includes(search.toLowerCase());
      });
      setUsersLocations(newLocations);
    }
  };

  return (
    <>
      <TableContainer className={classes.table} component={Paper}>
        <Typography variant="h4" color="primary" gutterBottom>
          React challenge
        </Typography>
        <Typography variant="h6" color="inherit" paragraph>
          this page was created to solve a react challenge:
          <ul>
            <li>
              Step 1: make an API call to retrieve users data and store it using{" "}
              <a href="https://randomuser.me" target="_blank" rel="noreferrer">
                https://randomuser.me
              </a>
              .
            </li>
            <li>
              Step 2: use the data to dynamically create a table where you
              display all the "locations" of the users flattened(location is a
              nested object).
            </li>
            <li>Step 3: add sorting capabilities to the table columns.</li>
            <li>Step 4: add search capabilities.</li>
          </ul>
        </Typography>
        <hr />
        <Grid container spacing={1}>
          <Grid item xs={6} sm={4} lg={2}>
            <TextField
              label="Search field"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Grid>
          <Grid item xs={2} sm={2} lg={2}>
            <div className={classes.searchButton}>
              <Button
                onClick={() => handleSearch()}
                variant="contained"
                color="primary"
              >
                Search!
              </Button>
            </div>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        {dataIsLoading ? (
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {[...Array(10)].map((x, i) => (
                  <TableCell align="center" key={i}>
                    <Typography component="div" variant={"h3"}>
                      <Skeleton variant="text" />
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((x, i) => (
                <TableRow key={i}>
                  {[...Array(10)].map((x, i) => (
                    <TableCell align="center" key={i}>
                      <Typography component="div" variant={"body1"}>
                        <Skeleton variant="text" />
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {userslocationsHeader.map((headerItem, index) => {
                  return (
                    <TableCell
                      align="center"
                      key={index}
                      onClick={() => handleSorting(headerItem)}
                    >
                      {headerItem} / {locationOrderHeader[headerItem]}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {userslocations.map((userLocation, index) => {
                return (
                  <TableRow key={index}>
                    {Object.values(userLocation).map((field, index) => {
                      return (
                        <TableCell align="center" key={index}>
                          {field}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
}

export default ReactChallenge;
