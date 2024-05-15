import { NextPage } from "next"
import styles from '@/styles/components/input/Toggle.module.scss'

type Props = {
    id?: string;
    className?: string;
    name?: string;
    label?: String;
    checked: boolean,
    stateChanger: (checkedVal: boolean) => void;
    hidden?: boolean
}

const Toggle: NextPage<Props> = ({
    name,
    className,
    id,
    label,
    checked,
    stateChanger,
    hidden
}: Props) => {
    if (hidden === undefined){
        hidden = false;
    }
    return (
        <span className={styles.Toggle} hidden={hidden}>
            <label className={styles.Toggle__Label}>{label}</label>
            <label className={styles.Toggle__Switch}>
                <input 
                    checked={checked}
                    onChange={() => stateChanger(!checked)} 
                    className={styles.Toggle__Checkbox} 
                    type="checkbox" 
                ></input>
                <span className={styles.Toggle__Slider}></span>
            </label>
        </span>
    );
}

export default Toggle