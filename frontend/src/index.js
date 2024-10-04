import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import reportWebVitals from './reportWebVitals';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Customize your primary color here
        },
        secondary: {
            main: '#dc004e', // Customize your secondary color here
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// Optional: Log performance metrics
reportWebVitals(console.log);
