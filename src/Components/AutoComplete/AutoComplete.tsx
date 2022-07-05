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
    isError: boolean
    onRetry: () => void
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
    currentList,
    minValueLength,
    placeholderText,
    onChange,
    inputValue,
    onSelectedItemClick,
    isFetching,
    isError,
    onRetry,
}) => {
    const [isOnFocus, setIsOnFocus] = useState(false)
    const [isItemHovered, setIsItemHovered] = useState(false)
    const [listCount, setListCount] = useState<number | null>(0)
    const [itemHoveredIndex, setItemHoveredIndex] = useState<number | null>(0)
    const [isArrowNavigationActive, setIsArrowNavigationActive] = useState(false)

    const listItemRef = useRef<HTMLLIElement[]>([])
    const [fetchCounter, setFetchCounter] = useState(0)

    //TODO: review -1
    const noMatches = inputValue.length > minValueLength - 1 && currentList.length === 0
    const listHasContent = isOnFocus && currentList.length > 0 && inputValue.length > minValueLength - 1 && !isFetching
    const shouldListDisplay = listHasContent || isItemHovered

    const noServiceMessage =
        fetchCounter < 3
            ? 'Oops! Something went wrong. To retry, click '
            : 'The service seems to be unavailable, please come back later or retry by clicking '

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
            case 'Enter':
                saveSelectedItem(currentList[listCount!])
                setIsOnFocus(false)
                document.querySelector('input')!.blur()
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

    const onFetchRetry = () => {
        onRetry()
        setFetchCounter(fetchCounter + 1)
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

    //TODO: Evaluate if error message should disappear on blur

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
                {shouldListDisplay &&
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

                {isFetching ? (
                    <li className={styles.hovered}>
                        <FontAwesomeIcon size='lg' icon={faRotate} spin />
                    </li>
                ) : isError ? (
                    <li className={styles.hovered}>
                        {noServiceMessage} <button onClick={onFetchRetry}>here</button>.
                    </li>
                ) : isOnFocus && noMatches ? (
                    <li className={styles.hovered}>No results found for "{inputValue}"</li>
                ) : null}
            </ul>
        </div>
    )
}

export default AutoComplete
