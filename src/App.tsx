import React, { useEffect, useState } from 'react'
import styles from './App.module.scss'
import AutoComplete from './Components/AutoComplete/AutoComplete'
import { useDebounceString } from './utils'
import { useLazyGetCitiesByNameQuery } from './api/citiesApi'

const App = () => {
    const [trigger, { data, isFetching, isSuccess, isError }] = useLazyGetCitiesByNameQuery()
    const [currentInputValue, setCurrentInputValue] = useState('')
    const searchValue = useDebounceString(currentInputValue, 300)
    const minValueLength = 3
    const currentList = isSuccess && data ? data : []
    const [shouldSearch, setShouldSearch] = useState(true)

    //TODO: Add background image to body and spinner until site is fully loaded

    useEffect(() => {
        if (shouldSearch && searchValue.length >= minValueLength) {
            trigger(searchValue)
        }
    }, [searchValue, trigger, shouldSearch])

    const onValueChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setCurrentInputValue(value)
        if (value !== searchValue) {
            setShouldSearch(true)
        }
    }

    const onSelectedItemClick = (value: string) => {
        setShouldSearch(false)
        setCurrentInputValue(value)
    }

    const onRetry = () => trigger(searchValue)

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
                    isError={isError}
                    onRetry={onRetry}
                />
            </div>
        </div>
    )
}

export default App
