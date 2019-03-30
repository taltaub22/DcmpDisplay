import React, { Component } from 'react'
import { Grid, Image, Header} from 'semantic-ui-react'

import './Header.css'

import DeepSpace from './Logos/DeepSpace.png'
import FirstIsrael from './Logos/FIRSTIsrael.png'

export default class AppHeader extends Component {
  render () {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Image src={FirstIsrael} size='small' centered verticalAlign='middle'/>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as='h1'>
              <Header.Content>
                <em>FIRST</em> Israel DCMP Control
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column width={3}>
            <Image src={DeepSpace} size='small' centered verticalAlign='middle'/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
