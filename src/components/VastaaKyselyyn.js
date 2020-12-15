import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { makeStyles, StylesProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Pagination from '@material-ui/lab/Pagination';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    alignItems: 'center',
    display: 'table',
    minWidth: '60vh'
  },
  vastaus: {
    paddingLeft: 42,
    paddingBottom: 20,
    paddingTop: 10,
    fontSize: '1.1rem',
    color: '#1f2021',
    padding: theme.spacing(1),
      textAlign: 'center',
      display: 'flex',
      alignContent: 'flex-start'
  },
  button:{
    margin: theme.spacing(1),
    marginLeft: '250%'

  },
  pagination: {
    marginBottom: '5vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 5,
  },
  teksti: {
    minWidth: '50vh',
    marginLeft: 10,
  },
  form: {
    borderRadius: 5,
    boxShadow: '5px 5px #C0C0C0',
  },
  leveys: {
    maxWidth: '60vh'
  },
}));

function VastaaKyselyyn(props) {
 
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [index, setIndex] = useState(0);
  const current = props.kysymykset[index]; // current.kysymys: "Mikä on hyvää", current.kysymystyyppi: "radio", current.vastaukset: "kyllä, ei, ..." }
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Päivittää sivun, jolloin kysely alkaa uudestaan.
  const refreshPage = () => {
    window.location.reload();
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  //POSTAA VASTAUKSEN
  const handleSubmit = () => {
    //KATSOTAAN, ONKO KYSYMYKSIÄ VIELÄ JÄLJELLÄ
    if (props.kysymykset.length-1 > index) {
      try {
        fetch('https://saucesix.herokuapp.com/postausVastaus', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nimi: props.nimi.nimi, // Kyselyn nimi
            kysymykset: [
              {
                nimi: current.kysymys, // Formissa valitun kysymyksen nimi
                kysymystyyppi: current.kysymystyyppi, // Formissa valitun kysymyksen tyyppi (radio, teksti...)
                vastaukset: [
                  {
                    teksti: value, // Valittu vastaus radiossa / Kirjoitettu teksti
                    onko: true
                  }
                ],
              }
            ]
          })})
          console.log('Submit onnistui :)')
          setIndex(index+1)
      } catch(error) {
        console.log('Submit ei onnistunut :(')
      }
    } else {
      try {
        fetch('https://saucesix.herokuapp.com/postausVastaus', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nimi: props.nimi.nimi, // Kyselyn nimi
            kysymykset: [
              {
                nimi: current.kysymys, // Formissa valitun kysymyksen nimi
                kysymystyyppi: current.kysymystyyppi, // Formissa valitun kysymyksen tyyppi (radio, teksti...)
                vastaukset: [
                  {
                    teksti: value, // Valittu vastaus radiossa / Kirjoitettu teksti
                    onko: true
                  }
                ],
              }
            ]
          })})
          console.log('Submit onnistui :)')
          handleClickOpen()
      } catch(error) {
        console.log('Submit ei onnistunut :(')
      }
    }
  }

  return (
    <StylesProvider injectFirst>
    <div>
      <Grid className={classes.pagination}>
      <Pagination
          classes={{ul: classes.pagination}}
          size='large' disabled='true'
          hideNextButton='true'
          hidePrevButton='true'
          page={index+1}
          shape='round'
          count={props.kysymykset.length}
        />
      </Grid>
        
        <Container className={classes.root} fixed>
        
        <FormControl className={classes.form} component="fieldset">
        <Paper>
          <FormLabel className={classes.vastaus}> {current.kysymys} </FormLabel>
          <Grid className={classes.root} container spacing={1}>
            { 
              //JOS KYSYMYSTYYPPI ON RADIO
              current.kysymystyyppi === "radio" &&
              <RadioGroup aria-label="radiokysymys" name="radiokysymys1" value={value} onChange={handleChange}>
              {current.vastaukset.map((v) => (
                <Grid className={classes.vastaus} item xs>
                  <FormControlLabel value={v.teksti} control={<Radio />} label={v.teksti}/>
                </Grid>  
              ))}
              </RadioGroup>
            }
            {
              //JOS KYSYMYSTYYPPI ON TEKSTI
              current.kysymystyyppi === "teksti" &&
              <TextField className={classes.teksti} rows={3} multiline label="Teksti" onChange={handleChange} variant='outlined'/>
            }
          </Grid>
            {
              //JOS SEURAAVIA KYSYMYKSIÄ ON NÄKYY BUTTON SEURAAVA, VIIMEISEN KYSYMYKSEN KOHDALLA LUKEE LÄHETÄ
              props.kysymykset.length-1 > index ?
              <Button style={{marginTop: 20, marginBottom: 20}} variant='outlined' onClick={() => {handleSubmit()}}>Seuraava</Button>
              : <Button style={{marginTop: 20, marginBottom: 20}} variant='outlined' onClick={() => {handleSubmit()}}>Lähetä</Button>
            }
          
            {/* DIALOGI AVAUTUU KUN KAIKKIIN KYSYMYKSIIN ON VASTATTU KÄYTTÄJÄ PAINAA LÄHETÄ PAINIKETTA */}
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={refreshPage}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">{"Kiitos, että vastasit kyselyymme"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                Voit vastata muihin kyselyihimme palaamalla etusivulle
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={refreshPage} color="primary">
                  Palaa etusivulle
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </FormControl>
    </Container>
    </div>
    </StylesProvider>
    
  );

}

export default VastaaKyselyyn;
