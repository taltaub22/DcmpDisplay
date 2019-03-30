import React, { Component } from 'react'
import { Loader, Radio, Form, Button, Icon, Dropdown } from 'semantic-ui-react'
import axios from 'axios'

export default class SelectMatch extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {loading: true, currentView: 'default.ejs'}
    this.getMatches()
  }

  getMatches () {
    axios.get('/tba/matches')
      .then(data => data.data)
      .then(matches => {
        let mappedMatches = matches.map(match => {
          return {
            key: match.key,
            text: `${match.comp_level.toUpperCase()} #${match.match_number} - ${match.actual_time != null ? 'Already played' : 'Not Played'}`,
            value: match.key,
            played: match.actual_time != null
          }
        })
        this.setState({
          isLoading: false,
          matches: mappedMatches
        })
      })
  }

  saveCurrentMatch () {
    axios.post('/tba/matches', {match: this.state.currentMatch})
  }

  handleDropChange (e, {value}) {
    this.setState({currentMatch: value})
  }

  render () {
    if (!this.state.isLoading && this.state.matches) {
      return (
        <Form>
          <Dropdown
            search
            placeholder='Please select a match'
            options={this.state.matches}
            onChange={this.handleDropChange.bind(this)}/>

          <br/>

          <Button size='mini' icon labelPosition='left' onClick={this.saveCurrentMatch.bind(this)}>
            Save
            <Icon name='save'/>
          </Button>
        </Form>
      )
    } else {
      return <div>Loading matches...</div>
    }

  }

}
