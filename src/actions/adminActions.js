import React from 'react';




const loginAdmin = (adminObj) => ({
    type: 'LOGIN_ADMIN',
    payload: adminObj
})

export const adminFetchPost = (admin) => {
    return dispatch => {
        return fetch('http://localhost:3000/api/v1/admins/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ admin })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.message) {
                    return
                } else {
                    localStorage.setItem("token", data.jwt)
                    dispatch(loginAdmin(data.admin))
                }
            })
    }

}




export const adminLoginFetch = admin => {
    return dispatch => {
      return fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({admin})
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.message) {
            // Here you should have logic to handle invalid login credentials.
            // This assumes your Rails API will return a JSON object with a key of
            // 'message' if there is an error
          } else {
            localStorage.setItem("token", data.jwt)
            dispatch(loginAdmin(data.admin))
          }
        })
    }
  }

export const getProfileFetch = () => {
    return dispatch => {
      const token = localStorage.token;
      if (token) {
        return fetch("http://localhost:3000/api/v1/profile", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(resp => resp.json())
          .then(data => {
            if (data.message) {
              // An error will occur if the token is invalid.
              // If this happens, you may want to remove the invalid token.
              localStorage.removeItem("token")
            } else {
              dispatch(loginAdmin(data.admin))
            }
          })
      }
    }
  }