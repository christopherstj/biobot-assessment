import React, { Fragment } from "react";
import axios from "axios";
import { ShippingData } from "./typeDefs/shippingData";
import {
    styled,
    Container,
    Unstable_Grid2 as Grid,
    Typography,
    TextField,
    Paper,
    LinearProgress,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
} from "@mui/material";
import Header from "./components/Header";

// Grid2 is deemed "unstable" because it breaks when combined with the original Grid component. When used on its own it is stable.

const Root = styled("div")(() => ({
    display: "flex",
    minHeight: "100vh",
    background:
        "linear-gradient(112deg, rgba(32, 53, 91, 0.25), rgb(245, 245, 245))",
    margin: -8,
    padding: 8,
}));

const StyledContainer = styled(Container)(() => ({
    display: "flex",
    flexFlow: "column",
    flexGrow: 1,
    marginTop: "96px",
}));

const StyledPaper = styled(Paper)(() => ({
    padding: 12,
}));

const StyledListItem = styled(ListItem, {
    shouldForwardProp: (p) => p !== "selected",
})<{
    selected?: boolean;
}>(({ theme, selected = false }) => ({
    cursor: "pointer",
    "&:hover": {
        background: "rgba(0, 0, 0, 0.2)",
    },
    ...(selected && {
        background: "rgba(0, 0, 0, 0.1)",
    }),
    ".MuiListItemText-primary": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
    },
}));

const StyledDivider = styled(Divider)(() => ({
    marginBottom: "16px",
}));

const today = new Date();

const MILLS_IN_WEEK = 86400000 * 7;

const App = () => {
    const [search, setSearch] = React.useState<string>("");
    const [result, setResult] = React.useState<ShippingData[]>([]);
    const [selectedResult, setSelectedResult] = React.useState<ShippingData>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();
    const [oneWeekFromToday, setOneWeekFromToday] = React.useState<Date>();

    const getData = () => {
        axios
            .get<ShippingData[]>(`api/kits-shipping?search=${search}`)
            .then((res) => {
                setResult(res.data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    };

    const clearResults = () => {
        setResult([]);
        setSelectedResult(undefined);
        setSearch("");
    };

    const Row = ({ title, value }: { title: string; value: string }) => (
        <Box display="flex" width="100%" marginBottom="32px">
            <Typography
                variant="body1"
                fontWeight="bold"
                flexBasis="50%"
                color="primary"
            >
                {title}
            </Typography>
            <Typography variant="body1" flexBasis="50%" color="primary">
                {value}
            </Typography>
        </Box>
    );

    React.useEffect(() => {
        setOneWeekFromToday(new Date(today.getTime() + MILLS_IN_WEEK));
    }, []);

    React.useEffect(() => {
        if (search.length > 0) {
            // only query if user stopped typing for 1 second to reduce api calls

            setLoading(true);
            if (timeoutId && parseInt(timeoutId.toString()) !== 0)
                clearTimeout(timeoutId);

            setTimeoutId(
                setTimeout(() => {
                    getData();
                }, 1000)
            );
        }
    }, [search]);

    return (
        <Root>
            <Header />
            <StyledContainer>
                <Grid container spacing={3} justifyContent="center">
                    <Grid
                        xs={12}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Typography variant="h4" color="primary" gutterBottom>
                            KITS Shipping Data
                        </Typography>
                        <Typography variant="body1">
                            Start typing a Label ID to search!
                        </Typography>
                    </Grid>
                    <Grid xs={12} sm={10} md={8} lg={6} xl={4}>
                        <StyledPaper>
                            <TextField
                                label="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                fullWidth
                            />
                            <Button fullWidth onClick={clearResults}>
                                Clear Results
                            </Button>
                        </StyledPaper>
                    </Grid>
                    <Grid xs={12} padding={0} margin={0} />
                    {loading ? (
                        <Grid xs={12}>
                            <LinearProgress />
                        </Grid>
                    ) : (
                        result.length > 0 && (
                            <Grid xs={12} md={6}>
                                <StyledPaper>
                                    <List>
                                        {result.map((r, index) => (
                                            <Fragment key={r.id}>
                                                <StyledListItem
                                                    selected={
                                                        selectedResult &&
                                                        selectedResult.label_id ===
                                                            r.label_id
                                                    }
                                                    onClick={() =>
                                                        setSelectedResult(r)
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={r.label_id}
                                                        secondary={`Tracking number: ${r.shipping_tracking_code}`}
                                                    />
                                                </StyledListItem>
                                                {index !==
                                                    result.length - 1 && (
                                                    <Divider />
                                                )}
                                            </Fragment>
                                        ))}
                                    </List>
                                </StyledPaper>
                            </Grid>
                        )
                    )}
                    {selectedResult && (
                        <Grid xs={12} md={6}>
                            <StyledPaper>
                                <Typography
                                    variant="h5"
                                    color="primary"
                                    fontWeight="bold"
                                    gutterBottom
                                    width="100%"
                                    textAlign="center"
                                >
                                    Shipment Details For{" "}
                                    {selectedResult.label_id}
                                </Typography>
                                <StyledDivider />
                                <Row
                                    title="Tracking Number"
                                    value={
                                        selectedResult.shipping_tracking_code
                                    }
                                />
                                <Row
                                    title="Departed On"
                                    value={today.toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                />
                                <Row
                                    title="Arriving On"
                                    value={oneWeekFromToday!.toLocaleDateString(
                                        undefined,
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                />
                                <Row
                                    title="Current Location"
                                    value="Flagstaff, AZ"
                                />
                            </StyledPaper>
                        </Grid>
                    )}
                </Grid>
            </StyledContainer>
        </Root>
    );
};

export default App;
