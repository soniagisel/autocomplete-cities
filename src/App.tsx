import React, { useEffect, useState } from 'react'
import styles from './App.module.scss'
import AutoComplete from './Components/AutoComplete/AutoComplete'
import ErrorPage from './Components/ErrorPage/ErrorPage'
import { useDebounceString } from './utils'
import { useLazyGetCitiesByNameQuery } from './api/citiesApi'

const App = () => {
    const [trigger, { data, isFetching, isSuccess, isError, error }] = useLazyGetCitiesByNameQuery()
    const [currentInputValue, setCurrentInputValue] = useState('')
    const searchValue = useDebounceString(currentInputValue, 300)
    const minValueLength = 3
    const currentList = isSuccess && data ? data : []

    //TODO: Add background image to body and spinner until site is fully loaded

    useEffect(() => {
        if (searchValue.length >= minValueLength) {
            trigger(searchValue)
        }
    }, [searchValue, trigger])

    if (isError) {
        return <ErrorPage />
    }

    const onValueChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setCurrentInputValue(value)
    }

    const onSelectedItemClick = (value: string) => setCurrentInputValue(value)

    return (
        <div onLoad={() => console.log('LOADED')} className={styles.app}>
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
