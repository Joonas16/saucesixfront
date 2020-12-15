import React from 'react';
import Kyselyt from './Kyselyt'


function FrontPage() {

    const image = {uri: '.../background.jpg'}

    return(
        <div style={{backgroundImage: `url(${image})`}}>
            <Kyselyt />
        </div>
    )
}

export default FrontPage;