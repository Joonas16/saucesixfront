import React, { useState, useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button'
import VastaaKyselyyn from './VastaaKyselyyn'
import { Container } from '@material-ui/core'


function Kyselyt() {
    const styles = {
        root: {
            margin: 'auto',
            textAlign: 'center',
        },
        form: {
            width: '50vh',
            textAlign: 'center',
            background: '#F5F5F5',
            padding: '5vh',
            borderRadius: 5,
            boxShadow: '5px 5px #C0C0C0',
        },
        kontti: {
            paddingTop: '10vh',
        },
    }

    const [value, setValue] = useState([]);
    const [kyselyt, setKyselyt] = useState([]);
    const [kysely, setKysely] = useState('')
    const [kysymykset, setKysymykset] = useState([]);
    const [kysymyksetJaVastaukset, setKysymyksetJaVastaukset] = useState([]);
    
    useEffect(() => fetchData(), [])

    const handleExport = (event) => {
        setKysely(event.target.value)
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    //Fetchaa kyselyt
    const fetchData = () => {
        fetch('https://saucesix.herokuapp.com/api/kyselies')
        .then(response => response.json())
        .then(data => {
            setKyselyt(data._embedded.kyselies)
        })
    }

    //Fetchaa valitun kyselyn kysymykset
    const fetchKysymykset = () => {
        fetch(kysely._links.kysymykset.href)
        .then(response => response.json())
        .then(data => {
        setKysymykset(data._embedded.kysymyses)
        })
    }

    //Fetchaa kysymyksiin niiden vastaukset, kun kysymykset on fetchattu
    const fetchVastaukset = () => {
        for (let i = 0; i < kysymykset.length; i++) {
            fetch(kysymykset[i]._links.vastaukset.href)
            .then(r => r.json())
            .then(data => {
                setKysymyksetJaVastaukset(kysymys => [...kysymys, {kysymys: kysymykset[i].nimi, kysymystyyppi: kysymykset[i].kysymystyyppi, vastaukset: data._embedded.vastauses}])
            })
            
        }
    }

    //Fetchaa vastaukset, kun kysymykset on fetchattu
    useEffect(() => fetchVastaukset(), [kysymykset])

    function valitseKysely() {
        return (
            <div style={styles.root}>
                <Container style={styles.kontti}>
                <FormControl style={styles.form}>
                    <InputLabel style={{ fontSize: '3.6vh', letterSpacing: '.7vh' }} variant="filled">Valitse Kysely</InputLabel>
                    <Select
                        labelId="kysely-valinta"
                        id="kysely-valinta"
                        onChange={handleChange, handleExport}
                        style={{ minWidth: 200, marginTop: '4vh' }}
                    >
                        {kyselyt.map((k) =>
                            <MenuItem 
                            value={k}
                            key={k.nimi}
                            >
                            {k.nimi}
                            </MenuItem>
                        )}
                    </Select>
                    <Button onClick={fetchKysymykset} style={{marginTop: '1vh'}} type="submit" variant="outlined" color="primary">
                        Submit
                    </Button>
                </FormControl>
                </Container>
            </div>
        );
    }

    return (
        <div>
            {
                kysymyksetJaVastaukset.length < 1 &&
                valitseKysely()
            }
            {
                kysymyksetJaVastaukset.length > 0 &&
                <VastaaKyselyyn nimi={kysely} kysymykset={kysymyksetJaVastaukset} />
            }
        </div>
    )

}
export default Kyselyt;
