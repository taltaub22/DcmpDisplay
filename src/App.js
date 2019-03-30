import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import './App.css'
import AppHeader from './components/Header/AppHeader'
import SelectView from './components/SelectView/SelectView'

class App extends Component {
  render () {
    return (
      <div className="App">
        <AppHeader/>
        <Grid columns={3}>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Header icon>
                <Icon name='desktop' circular/>
                <Header.Content>Select View</Header.Content>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                <Icon name='game' circular/>
                <Header.Content>Select Match</Header.Content>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                <Icon name='users' circular/>
                <Header.Content>Choose Team</Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <SelectView/>
            </Grid.Column>

            <Grid.Column>

            </Grid.Column>

            <Grid.Column>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default App
