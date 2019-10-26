import { FETCH_INSTRUCTORS, NEW_INSTRUCTOR, DELETE_INSTRUCTOR, REDUCE_HOURS } from './types';



const apiUrl = 'http://localhost:3000/instructors/'

export const fetchInstructors = () => {

    return function (dispatch) {

        fetch(apiUrl)
            .then(resp => resp.json())
            .then(instructors => dispatch({
                type: FETCH_INSTRUCTORS,
                payload: instructors
            }))
    }
}



export const createInstructor = (instructData) => {
    return function (dispatch) {
        dispatch({
            type: NEW_INSTRUCTOR,
            payload: instructData
        })
        fetch(apiUrl + 'instructors/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accepts: 'application/json'
            },
            body: JSON.stringify(instructData)
        })
    }
}

export const reduceInstructorsHoursBasedOnSession = (instructData, id) => {
    return function (dispatch) {
        dispatch({
            type:REDUCE_HOURS,
            payload: instructData
        })
        fetch(`apiUrl${id}`,{
         method: 'PATCH',
         headers:{
         'content-type':'application/json',
         accepts: 'application/json'
         },
         body:JSON.stringify(instructData)

        } )
    }
}

export const deleteInstructor = (id) => {
    return function (dispatch) {
        dispatch({
            type: DELETE_INSTRUCTOR,
            payload: id
        })
        fetch(`apiUrl${id}`, {
            method: 'DELETE'
        })

    }
}