const isElementInViewport = (element) => {
    const rect = element.getBoundingClientRect()
    console.log('rect', rect)
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

export default isElementInViewport
