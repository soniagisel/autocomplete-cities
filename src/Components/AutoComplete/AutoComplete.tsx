import React, { useEffect, useState, useRef } from 'react'
import styles from './AutoComplete.module.scss'
import { debounce, arrayContainsNull } from '../../utils/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'

interface AutoCompleteProps {
    currentList: string[]
    minValueLength: number
    placeholderText: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    inputValue: string
    onSelectedItemClick: (value: string) => void
    isFetching: boolean
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
    currentList,
    minValueLength,
    placeholderText,
    onChange,
    inputValue,
    onSelectedItemClick,
    isFetching,
}) => {
    const [isOnFocus, setIsOnFocus] = useState(false)
    const [isItemHovered, setIsItemHovered] = useState(false)
    const [listCount, setListCount] = useState<number | null>(0)
    const [itemHoveredIndex, setItemHoveredIndex] = useState<number | null>(0)
    const [isArrowNavigationActive, setIsArrowNavigationActive] = useState(false)

    const listItemRef = useRef<HTMLLIElement[]>([])
    // TODO: noMatches should have a condition to hide the error message on blur
    const noMatches = inputValue.length > minValueLength - 1 && currentList.length === 0
    const shouldListDisplay =
        (isOnFocus && currentList.length > 0 && inputValue.length > minValueLength - 1) || isItemHovered

    const delayMouseEvents = debounce(() => {
        setIsArrowNavigationActive(false)
    }, 300)

    const saveSelectedItem = (value: string) => {
        onSelectedItemClick(value)
        setIsItemHovered(false)
    }

    const handleArrowEvents = ({ key }: { key: string }) => {
        if (noMatches) return
        // Mouse events need to be delayed when using the arrow navigation so the counters work properly.
        setIsArrowNavigationActive(true)
        delayMouseEvents()

        let count
        const isValidIndex = (num: number) => num >= 0 && num < listItemRef.current.length
        switch (key) {
            case 'ArrowDown':
                count = listCount! + 1
                setListCount(count)
                setItemHoveredIndex(count)
                if (isValidIndex(count)) {
                    listItemRef.current[count].scrollIntoView(false)
                }
                break
            case 'ArrowUp':
                count = listCount! - 1
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

    const handleMouseEnter = (event: any) => {
        if (isArrowNavigationActive) return

        const hoveredElementIndex = event._targetInst.index
        setItemHoveredIndex(hoveredElementIndex)
        setListCount(hoveredElementIndex)
        setIsItemHovered(true)
    }

    const handleMouseLeave = () => {
        if (isArrowNavigationActive) return

        setItemHoveredIndex(null)
        setListCount(null)
        setIsItemHovered(false)
    }

    const assignRef = (ref: any, i: number) => {
        return (listItemRef.current[i] = ref)
    }

    useEffect(() => {
        if (listCount! < 0 && currentList.length > 0) {
            const lastPosition = currentList.length - 1
            setListCount(lastPosition)
            setItemHoveredIndex(lastPosition)
            listItemRef.current[lastPosition].scrollIntoView(false)
        } else if (listCount! >= currentList.length && !arrayContainsNull(listItemRef.current)) {
            setListCount(0)
            setItemHoveredIndex(0)
            listItemRef.current.length > 0 && listItemRef.current[0].scrollIntoView(true)
        }
    }, [listCount, currentList])

    return (
        <div className={styles.searchBoxContainer}>
            <input
                value={inputValue}
                // TODO: when on focus the 1st element in the list should be highlighted
                onFocus={() => setIsOnFocus(true)}
                onBlur={() => setIsOnFocus(false)}
                onChange={onChange}
                type='text'
                onKeyDown={handleArrowEvents}
                placeholder={placeholderText}
            />
            <ul>
                {!isFetching &&
                    shouldListDisplay &&
                    currentList.map((item, i) => (
                        //TODO: move list to another component to memoize
                        <li
                            key={i}
                            ref={(ref) => assignRef(ref, i)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => saveSelectedItem(item)}
                            className={listCount === i || itemHoveredIndex === i ? styles.hovered : ''}
                        >
                            {item}
                        </li>
                    ))}
                {isFetching && (
                    <li className={styles.hovered}>
                        <FontAwesomeIcon size='lg' icon={faRotate} spin />
                    </li>
                )}
                {!isFetching && noMatches && <li className={styles.hovered}>No results found for "{inputValue}"</li>}
            </ul>
        </div>
    )
}

export default AutoComplete
