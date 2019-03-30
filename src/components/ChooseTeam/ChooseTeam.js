import React, { Component } from 'react'
import { Button, Dropdown, Icon, Form } from 'semantic-ui-react'
import axios from 'axios'

export default class ChooseTeam extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {isLoading: true, currentTeam:''}
    this.getAllTeams()
  }

  getAllTeams () {
    axios.get('/tba/teams')
      .then(data => data.data)
      .then(teams => {
        let mappedTeams = teams.map(team => {
          return {
            key: 'frc'+team.team_number,
            text: `#${team.team_number} - ${team.nickname}`,
            value: 'frc'+team.team_number
          }
        })
        this.setState({
          isLoading: false,
          teams: mappedTeams
        })
      })
  }

  saveCurrentTeam () {
    axios.post('/tba/teams', {team: this.state.currentTeam})
      .then(stats => {
        this.state.lastTeamStats = stats
      })
  }

  handleDropChange (e, {value}) {
    this.setState({currentTeam: value})
  }

  render () {
    if (!this.state.isLoading && this.state.teams) {
      return (
        <Form>
          <Dropdown
            search
            placeholder='Please select a team'
            options={this.state.teams}
            onChange={this.handleDropChange.bind(this)}
          />
          <br/>
          <Button size='mini' icon labelPosition='left' onClick={this.saveCurrentTeam.bind(this)}>
            Save
            <Icon name='save'/>
          </Button>
        </Form>
      )

    } else {
      return <div>Loading teams...</div>
    }

  }
}

