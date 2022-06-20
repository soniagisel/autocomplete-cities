import React, { useState } from 'react'
import styles from './App.module.scss'
import AutoComplete from './Components/AutoComplete/AutoComplete'
import { debounce } from './utils'
import { useLazyGetCitiesByNameQuery } from './api/citiesApi'

const App = () => {
    const [
        trigger,
        { data, currentData, error, isUninitialized, isLoading, isFetching, isSuccess, isError },
    ] = useLazyGetCitiesByNameQuery()
    const minValueLength = 3
    const [currentInputValue, setCurrentInputValue] = useState('')
    const currentList = isSuccess && data ? data : []

    console.log('data', data)
    console.log('currentData', currentData)
    console.log('error', error)
    console.log('isUninitialized', isUninitialized)
    console.log('isLoading', isLoading)
    console.log('isFetching', isFetching)
    console.log('isFetching', isFetching)
    console.log('isSuccess', isSuccess)
    console.log('isError', isError)

    //TODO: Check debounce performance
    const requestCities = debounce((value: string) => {
        trigger(value)
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
                    currentList={currentList}
                    placeholderText='Sydney, Australia'
                    onChange={onValueChange}
                    inputValue={currentInputValue}
                    onSelectedItemClick={onSelectedItemClick}
                    minValueLength={minValueLength}
                    isFetching={isFetching}
                />
            </div>
        </div>
    )
}

export default App
