import React, { Component } from 'react'
import { fetchData } from '../services/ApiRequest'

class Summary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userContentReactions: [],
      individualIds: [],
      individualReacts: [],
      userReactList: [],
      legendTypes: ''
    }
    this.getUserContentReactions = this.getUserContentReactions.bind(this)
    this.getUserContentReactions = this.getUserContentReactions.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.mapMatchingUsers = this.mapMatchingUsers.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.toggleDialog = this.toggleDialog.bind(this)
  }

  getIndividualReactions () {
    const { reactions, contentId } = this.props
    const { individualIds, individualReacts } = this.state
    this.setState({ legendTypes: reactions })
    reactions.map(reaction => { // mapping all the reactions
      console.log(reaction)
      const reqRoute = `user_content_reactions?content_id=${contentId}&reaction_id=${reaction.id}`
      fetchData('get', reqRoute, '', 'json').then(response => { // getting individual id responses
        console.log(response)
        if (response.length > 0) individualIds.push(reaction)
        individualReacts[reaction.id] = response
        // console.log(individualIds)
        this.setState({ individualIds: individualIds, individualReacts: individualReacts })
      })
    }
    )
  }

  getUserContentReactions () {
    const reqRoute = `user_content_reactions?content_id=${this.props.contentId}`
    fetchData('get', reqRoute, '', 'json').then(response => {
      // console.log(response)
      this.setState({ userContentReactions: response })
    })
  }

  componentDidMount () {
    this.getUserContentReactions()
    this.getIndividualReactions()
  }

  componentDidUpdate (nextProps) {
    if (this.props.reactions !== nextProps.reactions) {
      this.getIndividualReactions()
    }
    if (this.props.allUsers !== nextProps.allUsers) {
      this.mapMatchingUsers()
    }
  }

  handleCloseDialog (ref) {
    this.refs[ref].classList.toggle('displayClass')
  }

  handleOpenDialog (id, ref) {
    // this.setState({})
    const { individualReacts } = this.state
    const { allUsers } = this.props
    // console.log(allUsers, individualReacts[id])
    const userReactList = []
    individualReacts[id].map((element, index) => {
      allUsers.map((user, index) => {
        if (element.user_id === user.id) {
          // console.log(user)
          userReactList.push(user)
        }
      })
    })
    console.log(userReactList)
    this.setState({ userReactList: userReactList })
    this.refs[ref].classList.toggle('displayClass')
  }

  toggleDialog (ref) {
    this.refs[ref].classList.toggle('displayClass')
  }

  mapMatchingUsers () {

  }

  render () {
    const {
      userContentReactions, legendTypes, individualIds,
      individualReacts, userReactList
    } = this.state
    const { contentId } = this.props
    console.log(individualIds)
    return (
      <div id='summary'>
        {
          <div className='post'>
            <div className='react-count'>
              {individualIds && individualIds.map((element, index) => {
                console.log(element)
                return (
                  <div key={index}>
                    <div
                      onMouseOver={() => this.handleOpenDialog(element.id, `user-list-${index}`)}
                      onMouseLeave={() => this.handleCloseDialog(`user-list-${index}`)}
                      className='emoji-images'
                    >{element.emoji}
                    </div>
                    <div ref={`user-list-${index}`} className='user-list'>
                      {console.log(userReactList)}
                      {userReactList.map((user, index) => {
                        console.log(user.first_name + ' ' + user.last_name)
                        return (
                          <div key={index}>{user.first_name + ' ' + user.last_name}</div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className='count'>{userContentReactions && userContentReactions.length}</div>
            </div>
            <div
              className='box'
              ref={`reaction-block-${contentId}`}
              onMouseOver={() => this.toggleDialog(`reaction-block-${contentId}`)}
              onMouseLeave={() => this.toggleDialog(`reaction-block-${contentId}`)}
            // className='reaction-block'
            >
              <input type='checkbox' id='like' className='field-reactions' />
              <label htmlFor='like' className='label-reactions'>
                Like
              </label>
              <div>
                <div className='toolbox' />
                <label className='overlay' htmlFor='like' />
                {legendTypes && legendTypes.map((element, index) => {
                // console.log(element.name)
                  return (
                    <button key={index} className={`reaction-${element.name.toLowerCase()}`}>
                      <span className='legend-reaction'>{element.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Summary
