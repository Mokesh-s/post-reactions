/* Below fetchData method reference site - https://github.com/github/fetch */

import fetch from 'cross-fetch'
const baseURL = 'https://artful-iudex.herokuapp.com/'

export function fetchData (reqType, reqRoute, reqBody, reqContentType) {
  if (reqType === 'get') { // get API Call without body
    return fetch(baseURL + reqRoute, {
      method: reqType, // get or post method
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(parseJSON) // to check API call whether query param or body param.
      .then(data => { return data })
      .catch(error => { return error })
  } else if (reqType === 'post') { // post API Call with body
    return fetch(baseURL + reqRoute, {
      method: reqType, // get or post method
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(reqBody)
    }).then(parseJSON) // to check API call whether query param or body param.
      .then(data => { return data })
      .catch(error => { return error })
  }
}

function parseJSON (response) {
  return response.json()
}
