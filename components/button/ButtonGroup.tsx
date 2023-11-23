import { NextPage } from "next";
import styles from "@/styles/components/button/ButtonGroup.module.scss"

type Props = {
    children?: React.ReactElement[] | React.ReactElement
    fullWidth?: boolean
    orientation?: 'horizontal' | 'vertical'
}

const ButtonGroup: NextPage<Props> = ({
    children,
    fullWidth = false,
    orientation,
}: Props) => {

    return (
        <div
            className={`
                ${styles.ButtonGroup}
                ${fullWidth? styles.ButtonGroup__FullWidth : ''}
                ${(orientation=='vertical')? styles.ButtonGroup__Vertical : ''}
            `}
        >
            {children}
        </div>
    );
}

export default ButtonGroup