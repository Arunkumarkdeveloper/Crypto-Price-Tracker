export const handleClickAway = (elmentRef, setState) => {
    const handleClickOutside = (event) => {
        if (elmentRef.current && !elmentRef.current.contains(event.target)) {
            setState(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}