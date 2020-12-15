import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; 
import { lightBlue, brown, deepPurple} from '@material-ui/core/colors';
import FrontPage from './components/FrontPage'
import CssBaseline from '@material-ui/core/CssBaseline';
import Image from './background.jpg';

const theme = createMuiTheme({
    palette: {
      primary: {main: '#000', contrastText: '#FFFFFF'},
      secondary: {main: deepPurple[300], contrastText: lightBlue[50]},
      text: {primary: '#000', secondary: brown[200] },
      background: {default: deepPurple[400]},
    },
  });

  const styles = {
    frontpage: {
      height: '100vh',
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
    }
  }

function App() {
  return(
      <div style={styles.frontpage}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <div>
            <CssBaseline />
              <Switch>
                <Route path='/' exact component={FrontPage}/>
              </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
