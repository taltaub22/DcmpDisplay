import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import axios from 'axios'

export default class ChooseTeam extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {isLoading: true}
    this.getAllTeams()
  }

  getAllTeams () {
    axios.get('/tba/teams')
      .then(data=>data.data)
      .then(teams => {
        let mappedTeams = teams.map(team => {
          return {
            key: team.team_number,
            text: `#${team.team_number} - ${team.nickname}`,
            value: team.team_number
          }
        })
        this.setState({
          isLoading: false,
          teams: mappedTeams
        })
      })
  }

  saveCurrentTeam(){

  }

  render () {
    if(!this.state.isLoading && this.state.teams){
      return (
        <Dropdown
          search
          placeholder='Please select a team'
          options={this.state.teams}/>
      )
    } else{
      return <div>Loading teams...</div>
    }

  }
}

