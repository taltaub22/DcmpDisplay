import React, { Component } from 'react'
import { Loader, Radio, Form, Button, Icon } from 'semantic-ui-react'
import axios from 'axios'

export default class SelectView extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {loading: true, currentView: 'default.ejs'}
    this.getViews()
  }

  getViews () {
    axios.get('/view')
      .then(data => data.data)
      .then(views => {
        this.setState({views, loading: false})
      })
      .catch(err => {
        this.setState({error: err.message, loading: false})
      })
  }

  handleViewSelect(e, {value}){
    this.setState({currentView: value})
  }

  saveView(){
    axios.post('/view', {view: this.state.currentView})
  }

  render () {

    if (!this.state.error && !this.state.loading) {

      let views = this.state.views.map(view => {
        return (
          <Form.Field key={'field-' + view}>
            <Radio
              label={view}
              name='radioGroup'
              value={view}
              key={view}
              onChange={this.handleViewSelect.bind(this)}
              checked={this.state.currentView === view}
            />
          </Form.Field>)
      })


      return (
        <Form>
          {views}
          <Button size='mini' icon labelPosition='left' onClick={this.saveView.bind(this)}>
            Save
            <Icon name='save'/>
          </Button>
        </Form>
      )
    }

    if (this.state.error && !this.state.loading) {
      return <div>{this.state.error}</div>
    }

    if (this.state.loading) {
      return (<Loader content='Loading'/>)
    }
  }

}
