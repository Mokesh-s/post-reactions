import React, { Component } from 'react'
import Summary from './components/Summary/Summary'
import { fetchData } from './services/ApiRequest'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contentId: [1, 2], // static declaration of content Id's
      reactions: [],
      allUsers: []
    }
    this.getReactions = this.getReactions.bind(this)
    this.getUsers = this.getUsers.bind(this)
  }

  getReactions () {
    const reqRoute = 'reactions'
    fetchData('get', reqRoute, '', 'json').then(response => {
      this.setState({ reactions: response })
    })
  }

  getUsers () {
    const reqRoute = 'users'
    fetchData('get', reqRoute, '', 'json').then(response => {
      this.setState({ allUsers: response })
    })
  }

  componentDidMount () {
    this.getReactions()
    this.getUsers()
  }

  render () {
    const { contentId, reactions, allUsers } = this.state
    return (
      <div id='app'>
        {contentId.map((element, index) => { // passing content specific props to the child components
          return (
            <Summary
              key={index} contentId={element} reactions={reactions}
              allUsers={allUsers}
            />
          )
        })}
      </div>
    )
  }
}
