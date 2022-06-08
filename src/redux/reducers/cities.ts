import { searchCities } from '../../api/citiesApi'
import { AnyAction } from 'redux'

interface InitialState {
    citiesList: string[]
}

const initialState: InitialState = {
    citiesList: [],
}

export enum ACTION_TYPES {
    SEARCH = 'SEARCH',
}

const cities = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case ACTION_TYPES.SEARCH:
            return {
                ...state,
                citiesList: action.payload.citiesList,
            }
        default:
            return state
    }
}

export const dispatchSearchCity = async (inputVal: string) => await searchCities(inputVal)

export default cities
