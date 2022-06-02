import React, { useEffect, useState, useRef } from 'react'
import styles from './AutoComplete.module.scss'
import { dispatchSearchCity } from '../src/redux/reducers/cities'
import { useDispatch, useSelector } from 'react-redux'
import { ACTION_TYPES } from '../src/redux/reducers/cities'
import { debounce, arrayContainsNull } from './utils/index'

const AutoComplete = () => {
    const dispatch = useDispatch()
    const listItemRef = useRef([])
    const currentCitiesList = useSelector((state) => state.cities.citiesList)

    const [currentCityName, setCurrentCityName] = useState('')
    const [isOnFocus, setIsOnFocus] = useState(false)
    const [isItemHovered, setIsItemHovered] = useState(false)
    const [listCount, setListCount] = useState(0)
    const [itemHoveredIndex, setItemHoveredIndex] = useState(0)
    const [isArrowNavigationActive, setIsArrowNavigationActive] = useState(false)

    const noMatches = currentCityName.length > 2 && currentCitiesList.length === 0
    const shouldListDisplay = (isOnFocus && currentCitiesList.length > 0 && currentCityName.length > 2) || isItemHovered

    const requestCities = debounce(async (value) => {
        dispatch({
            type: ACTION_TYPES.SEARCH,
            payload: { citiesList: await dispatchSearchCity(value) },
        })
    }, 300)

    const delayMouseEvents = debounce(() => {
        setIsArrowNavigationActive(false)
    }, 300)

    const onValueChange = async (event) => {
        const value = event.target.value

        setCurrentCityName(value)

        if (value.length >= 3) {
            requestCities(value)
        }
    }

    const saveSelectedCity = (value) => {
        setCurrentCityName(value)
        setIsItemHovered(false)
    }

    const handleArrowEvents = ({ key }) => {
        if (noMatches) return
        setIsArrowNavigationActive(true)
        delayMouseEvents()

        let count
        const isValidIndex = (num) => num >= 0 && num < listItemRef.current.length
        switch (key) {
            case 'ArrowDown':
                count = listCount + 1
                setListCount(count)
                setItemHoveredIndex(count)
                if (isValidIndex(count)) {
                    listItemRef.current[count].scrollIntoView(false)
                }
                break
            case 'ArrowUp':
                count = listCount - 1
                setListCount(count)
                setItemHoveredIndex(count)
                if (isValidIndex(count)) {
                    listItemRef.current[count].scrollIntoView(true)
                }
                break
            default:
                return
        }
    }

    const mouseEnter = (event) => {
        if (isArrowNavigationActive) return

        const hoveredElementIndex = event._targetInst.index
        setItemHoveredIndex(hoveredElementIndex)
        setListCount(hoveredElementIndex)
        setIsItemHovered(true)
    }

    const mouseLeave = () => {
        if (isArrowNavigationActive) return

        setItemHoveredIndex(null)
        setListCount(null)
        setIsItemHovered(false)
    }

    useEffect(() => {
        if (listCount < 0 && currentCitiesList.length > 0) {
            const lastPosition = currentCitiesList.length - 1
            setListCount(lastPosition)
            setItemHoveredIndex(lastPosition)
            listItemRef.current[lastPosition].scrollIntoView(false)
        } else if (listCount >= currentCitiesList.length && !arrayContainsNull(listItemRef.current)) {
            setListCount(0)
            setItemHoveredIndex(0)
            listItemRef.current.length > 0 && listItemRef.current[0].scrollIntoView(true)
        }
    }, [listCount, currentCitiesList])

    return (
        <div className={styles.searchBoxContainer}>
            <input
                value={currentCityName}
                onFocus={() => setIsOnFocus(true)}
                onBlur={() => setIsOnFocus(false)}
                onChange={onValueChange}
                type='text'
                onKeyDown={handleArrowEvents}
                placeholder='Sydney, Australia'
            />
            <ul>
                {shouldListDisplay &&
                    currentCitiesList.map((city, i) => (
                        <li
                            key={i}
                            ref={(ref) => (listItemRef.current[i] = ref)}
                            onMouseEnter={mouseEnter}
                            onMouseLeave={mouseLeave}
                            onClick={() => saveSelectedCity(city)}
                            className={listCount === i || itemHoveredIndex === i ? styles.hovered : ''}
                        >
                            {city}
                        </li>
                    ))}
                {noMatches && <li className={styles.hovered}>No results found for "{currentCityName}"</li>}
            </ul>
        </div>
    )
}

export default AutoComplete
