import React, { useEffect, useState, useRef } from 'react'
import styles from './AutoComplete.module.scss'
import { dispatchSearchCity } from '../src/redux/reducers/cities'
import { useDispatch, useSelector } from 'react-redux'
import { ACTION_TYPES } from '../src/redux/reducers/cities'
import { debounce } from './utils/index'

const AutoComplete = () => {
    const dispatch = useDispatch()
    const currentCityName = useSelector((state) => state.cities.cityName)
    const currentCitiesList = useSelector((state) => state.cities.citiesList)

    const listItemRef = useRef([])

    const [isOnFocus, setIsOnFocus] = useState(false)
    const [isItemHovered, setIsItemHovered] = useState(false)
    const shouldListDisplay =
        (isOnFocus && currentCitiesList?.length > 0 && currentCityName?.length > 2) || isItemHovered
    const [listCount, setListCount] = useState(0)
    const [itemHoveredIndex, setItemHoveredIndex] = useState(0)

    const requestCities = debounce(async (value) => {
        dispatch({
            type: ACTION_TYPES.SEARCH,
            payload: { citiesList: await dispatchSearchCity(value) },
        })
    }, 500)

    const onValueChange = async (event) => {
        const value = event.target.value

        dispatch({ type: ACTION_TYPES.SAVE_CITY_NAME, payload: { cityName: value } })

        if (value.length >= 3) {
            requestCities(value)
        }
    }

    const saveSelectedCity = (value) => {
        dispatch({ type: ACTION_TYPES.SAVE_CITY_NAME, payload: { cityName: value } })
        setIsItemHovered(false)
    }

    const handleArrowEvents = ({ key }) => {
        let count
        const indexExists = listItemRef.current.indexOf(listItemRef.current[count])
        if (key === 'ArrowDown') {
            count = listCount + 1
            if (indexExists) {
                setListCount(count)
                setItemHoveredIndex(count)
                if (count >= 0 && count < listItemRef.current.length) {
                    listItemRef.current[count].scrollIntoView(false)
                }
            }
        } else if (key === 'ArrowUp') {
            count = listCount - 1
            if (indexExists) {
                setListCount(count)
                setItemHoveredIndex(count)
                if (count >= 0 && count < listItemRef.current.length) {
                    listItemRef.current[count].scrollIntoView(true)
                }
            }
        }
    }

    const mouseEnter = (event) => {
        const hoveredElementIndex = event._targetInst.index
        setItemHoveredIndex(hoveredElementIndex)
        setListCount(hoveredElementIndex)
        setIsItemHovered(true)
    }

    const mouseLeave = () => {
        setItemHoveredIndex(null)
        setListCount(null)
        setIsItemHovered(false)
    }

    useEffect(() => {
        if (listCount < 0) {
            const lastPosition = currentCitiesList.length - 1
            setListCount(lastPosition)
            listItemRef.current[lastPosition].scrollIntoView(false)
        } else if (listCount >= currentCitiesList?.length) {
            setListCount(0)
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
            </ul>
        </div>
    )
}

export default AutoComplete
