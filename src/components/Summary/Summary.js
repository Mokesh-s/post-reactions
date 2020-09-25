import React, { Component } from 'react'
import { fetchData } from '../../services/ApiRequest'
import Overlay from '../Overlay/Overlay'
import ReactTooltip from 'react-tooltip'

class Summary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userContentReactions: [],
      individualIds: [],
      individualReacts: [],
      userReactList: [],
      legendTypes: '',
      userId: '',
      isOverlayOpen: false,
      showLegends: false
    }
    this.getUserContentReactions = this.getUserContentReactions.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.mapMatchingUsers = this.mapMatchingUsers.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.toggleDialog = this.toggleDialog.bind(this)
    this.toggleLike = this.toggleLike.bind(this)
    this.clearLegends = this.clearLegends.bind(this)
    this.handlePostReaction = this.handlePostReaction.bind(this)
    this.handleGetDetails = this.handleGetDetails.bind(this)
    this.hideOverlay = this.hideOverlay.bind(this)
  }

  hideOverlay () {
    this.setState({ isOverlayOpen: false })
  }

  handleGetDetails () {
    this.setState({ isOverlayOpen: true, showLegends: false })
  }

  handlePostReaction (element) {
    const { userContentReactions, userId, legendTypes } = this.state
    const newUserContentReaction = {
      id: 1000,
      user_id: userId,
      reaction_id: element ? element.id : 1,
      content_id: this.props.contentId
    }
    if (userContentReactions.some(element => element.id === 1000)) {
      userContentReactions.pop()
    }
    let reactedIcon = ''
    legendTypes && legendTypes.map(legendType => {
      if (legendType.id === newUserContentReaction.reaction_id) { // new reactions
        reactedIcon = legendType
      }
      if (!element && this.state.reactedIcon) { // unlike
        reactedIcon = ''
      }
    }
    )
    if (reactedIcon) userContentReactions.push(newUserContentReaction)
    this.setState({
      userContentReactions: userContentReactions,
      showLegends: false,
      reactedIcon: reactedIcon
    })
    // const reqRoute = `user_content_reactions`
    // // const params = newUserContentReaction
    // const params = {
    //   id: 12390,
    //   user_id: 345345231,
    //   reaction_id: element.id,
    //   content_id: this.props.content_id
    // }
    // fetchData('post', reqRoute, params, 'json').then(response => {
    //   console.log(response)
    // })
  }

  getIndividualReactions () {
    const { reactions, contentId } = this.props
    const { individualIds, individualReacts } = this.state
    reactions.map(reaction => { // mapping all the reactions
      const reqRoute = `user_content_reactions?content_id=${contentId}&reaction_id=${reaction.id}`
      fetchData('get', reqRoute, '', 'json').then(response => { // getting individual id responses
        if (response.length > 0) individualIds.push(reaction)
        individualReacts[reaction.id] = response
        this.setState({
          individualIds: individualIds,
          individualReacts: individualReacts
        })
      })
    }
    )
  }

  getUserContentReactions () {
    const reqRoute = `user_content_reactions?content_id=${this.props.contentId}`
    fetchData('get', reqRoute, '', 'json').then(response => {
      this.setState({ userContentReactions: response })
    })
  }

  componentDidMount () {
    // const current_date = new Date()
    // const cms = current_date.getMilliseconds()
    // this.setState({ userId: cms })
    this.setState({ userId: 10 })
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
    if (this.props.contentId) {
      this.refs[`likeButton-${this.props.contentId}`].addEventListener('mouseenter', this.toggleLike)
    }
  }

  handleCloseDialog (ref) {
    this.refs[ref].classList.toggle('displayClass')
  }

  handleOpenDialog (id, ref) {
    const { individualReacts } = this.state
    const { allUsers } = this.props
    const userReactList = []
    individualReacts[id].map((element, index) => {
      allUsers.map((user, index) => {
        if (element.user_id === user.id) {
          userReactList.push(user)
        }
      })
    })
    this.setState({ userReactList: userReactList })
    if (ref) this.refs[ref].classList.toggle('displayClass')
  }

  toggleDialog (ref) {
    this.refs[ref].classList.toggle('displayClass')
  }

  toggleLike (ref) {
    this.setState({ legendTypes: this.props.reactions, showLegends: true })
  }

  clearLegends () {
    setTimeout(() => {
      this.setState({ showLegends: false })
    }, 1000)
  }

  mapMatchingUsers () {

  }

  render () {
    const {
      userContentReactions, legendTypes, individualIds, showLegends,
      individualReacts, userReactList, isOverlayOpen, reactedIcon
    } = this.state
    const { contentId, allUsers } = this.props
    // let reactedIcon = userContentReactions.find(element => element.id === 1000)
    // if (legendTypes && reactedIcon) {
    //   reactedIcon = legendTypes.find(element => element.id === reactedIcon.reaction_id)
    // }
    return (
      <div id='summary'>
        {isOverlayOpen && <Overlay // overlay for details
          individualIds={individualIds}
          individualReacts={individualReacts}
          userReactList={userReactList}
          allUsers={allUsers}
          hideOverlay={this.hideOverlay.bind(this)}
          contentId={contentId}
          />}
        {
          <div className='post'>
            <div>Content: {this.props.contentId}</div>
            <div className='react-count'>
              {individualIds && individualIds.map((element, index) => {
                return (
                  <div key={index}>
                    <div
                      onMouseOver={() => this.handleOpenDialog(element.id, `user-list-${index}`)}
                      onMouseLeave={() => this.handleCloseDialog(`user-list-${index}`)}
                      className='emoji-images'
                    >{element.emoji}
                    </div>
                    <div ref={`user-list-${index}`} className='user-list'>
                      {userReactList.map((user, index) => {
                        return (
                          <div className='user-name' key={index}>{user.first_name + ' ' + user.last_name}</div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className='count' onClick={this.handleGetDetails}>
                {userContentReactions && userContentReactions.length}
              </div>
            </div>
            <div
              className='box-1'
              ref='box-1'
              onMouseLeave={() => this.clearLegends(`like-button-${contentId}`)}
            >
              <div ref={`like-button-${contentId}`} className='like-items'>
                {showLegends && legendTypes &&
                  <div className='reactions-container'>{
                    legendTypes.map((element, index) => {
                      return (
                        <div data-tip={element.name} key={index} className='like-item' onClick={() => this.handlePostReaction(element)}>
                          {element.emoji}
                        </div>
                      )
                    })
                  }
                    <ReactTooltip />
                  </div>}
              </div>
              <div
                onClick={() => this.handlePostReaction()}
                className='like-button'
                ref={`likeButton-${contentId}`}
              >
                {reactedIcon
                  ? <div>
                    <span>{reactedIcon.emoji}&nbsp;</span>
                    <span>{reactedIcon.name}</span>
                    </div>
                  : <span> Like </span>}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Summary
