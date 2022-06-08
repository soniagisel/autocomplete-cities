import React, { useState } from 'react'
import styles from './App.module.scss'
import AutoComplete from './Components/AutoComplete/AutoComplete'
import { useSelector, useDispatch } from 'react-redux'
import { debounce } from './utils'
import { ACTION_TYPES, dispatchSearchCity } from './redux/reducers/cities'
import { RootState } from './redux/store'

const App = () => {
    const dispatch = useDispatch()
    const minValueLength = 3
    const citiesList = useSelector((state: RootState) => state.cities.citiesList)
    const [currentInputValue, setCurrentInputValue] = useState('')

    const requestCities = debounce(async (value: string) => {
        dispatch({
            type: ACTION_TYPES.SEARCH,
            payload: { citiesList: await dispatchSearchCity(value) },
        })
    }, 300)

    const onValueChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value

        setCurrentInputValue(value)

        if (value.length >= minValueLength) {
            requestCities(value)
        }
    }

    const onSelectedItemClick = (value: string) => setCurrentInputValue(value)

    return (
        <div className={styles.app}>
            <div className={styles.wrapper}>
                <h1>Welcome to the Cities Finder</h1>
                <h2>Start typing and we'll help you find the city you're looking for!</h2>

                <AutoComplete
                    currentList={citiesList}
                    placeholderText='Sydney, Australia'
                    onChange={onValueChange}
                    inputValue={currentInputValue}
                    onSelectedItemClick={onSelectedItemClick}
                    minValueLength={minValueLength}
                />
            </div>
        </div>
    )
}

export default App
