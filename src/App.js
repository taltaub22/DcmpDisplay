import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import './App.css'
import AppHeader from './components/Header/AppHeader'

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
                  <Icon name='users' circular/>
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
          </Grid>
      </div>
    )
  }
}

export default App
