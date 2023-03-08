import React from "react";
import { styled, Container, AppBar, Toolbar, Typography } from "@mui/material";

const StyledImg = styled("img")(() => ({
    maxHeight: "50px",
    width: "auto",
    marginRight: "12px",
    zIndex: 1,
}));

const Header = () => {
    return (
        <AppBar color="primary">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <StyledImg src="logo.svg" />
                    <Typography
                        flexGrow="1"
                        textAlign="right"
                        color="white"
                        marginRight="24px"
                    >
                        Shipping Data Search
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
