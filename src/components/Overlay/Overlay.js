import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'
// import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import './Overlay.css'
import './OverlayResponsive.css'
import { fetchData } from '../../services/ApiRequest'

class Overlay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userReactList: [],
      show: false,
      selectedTab: ''
    }
    this.handleAnimation = this.handleAnimation.bind(this)
    this.delayHandle = this.delayHandle.bind(this)
  }

  // componentName () {
  //   switch (this.props.typeOfComponent) {
  //     case 'ProductDescription':
  //       return <ProductDescription hideOverlay={this.props.hideOverlay} />
  //     // case 'Booking':
  //     //   return <Booking hideOverlay={this.props.hideOverlay} />
  //     // case 'ClassDetails':
  //     //   return <ClassDetails hideOverlay={this.props.hideOverlay} workout={this.props.workout}classType={this.props.classType} />
  //     // case 'FreeTrial':
  //     //   return <FreeTrial hideOverlay={this.props.hideOverlay} ID={this.props.ID} />
  //     // case 'InviteNow':
  //     //   return <InviteNow hideOverlay={this.props.hideOverlay} />
  //     //   case 'Etiquette':
  //     //   return <Etiquette hideOverlay={this.props.hideOverlay} />
  //     default :
  //       return null
  //   }
  // }

  // hide background scroll
  componentDidMount () {
    const targetElement = document.querySelector('body')
    targetElement.style.overflow = 'hidden'
    // disableBodyScroll(targetElement)
    // disableBodyScroll('body')
    this.setState({ show: !this.state.show })
    this.handleOpenDialog()
  }

  // reset background scroll
  componentWillUnmount () {
    // clearAllBodyScrollLocks()
    const targetElement = document.querySelector('body')
    targetElement.style.overflow = 'auto'
    this.setState({ show: !this.state.show })
  }

  delayHandle () {
    setTimeout(() => {
      this.setState({ show: !this.state.show })
      this.props.hideOverlay()
    }, 1000)
  }

  handleAnimation () {
    this.setState({ show: !this.state.show })
    setTimeout(() => { this.props.hideOverlay() }, 300)
  }

  handleOpenDialog (id) {
    const { individualReacts, allUsers, contentId } = this.props
    const userReactList = []
    if (id) {
      individualReacts[id].map((element, index) => {
        allUsers.map((user, index) => {
          if (element.user_id === user.id) {
            // console.log(user)
            userReactList.push(user)
          }
        })
      })
      this.setState({ userReactList: userReactList, selectedTab: id })
    } else {
      // userReactList = allUsers
      const reqRoute = `user_content_reactions?content_id=${contentId}`
      fetchData('get', reqRoute, '', 'json').then(response => { // getting individual id responses
        if (response.length > 0) {
          response.map((element) => {
            allUsers.map((user) => {
              if (element.user_id === user.id) {
                userReactList.push(user)
              }
            })
          })
        }
        this.setState({ userReactList: userReactList, selectedTab: 'all' })
      })
    }
  }

  render () {
    // const component = this.componentName()
    const { individualIds, individualReacts } = this.props
    const { userReactList, selectedTab } = this.state
    // console.log(userReactList)
    // individualIds.unshift({ id: 0, name: 'All', emoji: 'All' })
    return (
      <Fade when={this.state.show}>
        <div id='overlay'>
          <div className='overlay-block'>
            <div className='overlay-body'>
              <div class='overlay-header'>
                <div class='title-text' />
                <div className='close-img' onClick={this.handleAnimation}>
                  <img className='img-cls' src='/assets/images/close-icon.png' />
                </div>
              </div>
              <div className='details-tabs'>
                <div className='emoji-container'>
                  <div
                    className={(selectedTab === 'all') ? 'emoji-img active' : 'emoji-img'}
                    onClick={() => this.handleOpenDialog()}
                  >
                    All
                  </div>
                  {individualIds && individualIds.map((element, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => this.handleOpenDialog(element.id)}
                        className={(selectedTab === element.id) ? 'emoji-img active' : 'emoji-img'}
                      >
                        <span>{element.emoji}</span>
                        {/* <span>{console.log(individualReacts[element.id])}{individualReacts[element.id].length}</span> */}
                      </div>
                    )
                  })}
                </div>
                <div className='details'>
                  <div className='user-listing'>
                    {userReactList.map((user, index) => {
                      return (
                        <div className='user-name' key={index}>{user.first_name + ' ' + user.last_name}</div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            )
            {/* <div className='overlay-body'>
              <div className='close-img' onClick={this.handleAnimation} />
              {component}
            </div> */}
          </div>
        </div>
      </Fade>
    )
  }
}

export default Overlay
