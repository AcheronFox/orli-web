import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/PaginationTable.module.scss";

type Props = {
    columnData: Array<string> | undefined;
    tableData: Array<Object> | undefined;
    customTableClass?: string;
    customRowClass?: string;
    customCellClass?: string;
    customHeaderClass?: string;
};

const PaginationTable: NextPage<Props> = (props: Props) => {

    const capitalizeLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    if (!props.columnData || !props.tableData) {
        return null
    }

    const isDate = (date: string) => {
        const regExp  = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$');
        return regExp.test(date);
    }
    const createDatePatternFromDate = (date: Date) => {
        if (!date) return
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + (date.getDate())).slice(-2);
    
        return `${year}.${month}.${day}.`
    }

    return (
        <table className={`${styles.Table} ${props.customTableClass}`}>
            <thead>
                <tr className={`${styles.Table__Header} ${props.customHeaderClass}`}>
                    {
                        props.columnData.map((val: string, i) => {
                            return (
                                <th key={i}>{capitalizeLetter(val)}</th>
                            );
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props.tableData.map((val: any, i) => {
                        return (
                            <tr key={i} className={`${styles.Table__Row} ${props.customRowClass}`}>
                                {
                                    Object.keys(val).map((key: string, j) => {
                                        return (
                                            <td key={j} className={`${styles.Table__Cell} ${props.customCellClass}`}>{isDate(val[key as keyof any])? createDatePatternFromDate(new Date(val[key as keyof any])) : val[key as keyof any]}</td>
                                        );
                                    })
                                }
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
};

export default PaginationTable;