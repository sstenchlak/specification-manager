import React from 'react';
import {AppBar, Container, Toolbar, Typography} from "@mui/material";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Home} from "./routes/home/home";
import {Specification} from "./routes/specification/specification";

function App() {
    return (
        <BrowserRouter>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={Link} to={`/`} sx={{color: "white", textDecoration: "none"}}>
                        Specification manager
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/specification/:specificationId" element={<Specification/>}/>
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;
