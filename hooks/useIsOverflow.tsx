import * as React from 'react';

export const useIsOverflow = (ref: any, callback?: Function) => {
    const [isOverflow, setIsOverflow] = React.useState<boolean>();

    React.useLayoutEffect(() => {
        const { current } = ref;

        const trigger = () => {
            const hasOverflow = (current.scrollWidth > current.clientWidth);

            setIsOverflow(hasOverflow);

            if (callback) callback(hasOverflow);
        };

        if (current) {
            trigger();
        }
    }, [callback, ref]);

    return isOverflow;
};