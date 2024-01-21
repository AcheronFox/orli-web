/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";

const useIsMobile = () => {
    const [width, setWidth] = useState(0);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 600);
}

export default useIsMobile