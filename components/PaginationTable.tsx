/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/PaginationTable.module.scss";
import getNationality from "../functions/getNationality";
import { useTranslate } from "@/hooks/useTranslate";
import DropDown from "./DropDown";
import SecondaryButton from "./SecondaryButton";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri"
import Link from "next/link";

type Props = {
    columnData: Array<string>;
    tableData: Array<Object>;
    pageSize: number;
    currentPage: number;
    paginationChoices: number[];
    numberOfItems: number;
    customTableClass?: string;
    customRowClass?: string;
    customCellClass?: string;
    customHeaderClass?: string;
    onPageSizeChange?: Function;
    onPageMove?: Function;
    onRowClick?: Function;
};

const PaginationTable: NextPage<Props> = (props: Props) => {
    const { t, locale } = useTranslate();    

    const move = (e: number) => {
        if (props.onPageMove) props.onPageMove(e)
    }
    const changeSize = (e: number) => {
        if (props.currentPage >= ((props.numberOfItems || props.tableData.length) / props.pageSize)-1) move(0)
        if (props.onPageSizeChange) props.onPageSizeChange(e)
    }


    const capitalizeLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
        <div className={`${styles.Table__Wrapper}`}>
            <div className={`${styles.Table__Wrapper__Internal}`}>
                <table className={`${styles.Table} ${props.customTableClass}`}>
                    <thead>
                        <tr className={`${styles.Table__Header} ${props.customHeaderClass}`}>
                            {
                                (props.columnData.length != 0) &&
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
                            (props.tableData.length != 0) &&
                            props.tableData.map((val: any, i) => {
                                return (
                                    <>
                                        {
                                            (!props.onRowClick) &&
                                            <tr key={i} className={`${styles.Table__Row} ${props.customRowClass}`}>
                                                {
                                                    
                                                    Object.keys(val).map((key: string, j) => {
                                                        if (key.toLowerCase() == 'nationality') {
                                                            val = {...val, nationality: getNationality(val[key as keyof any], locale)?.name || val[key]}
                                                        }
                                                        return (
                                                            <td key={j} className={`${styles.Table__Cell} ${props.customCellClass}`}>{isDate(val[key])? createDatePatternFromDate(new Date(val[key])) : val[key]}</td>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        }
                                        {
                                            (props.onRowClick) &&
                                            <Link key={i} className={`${styles.Table__Row} ${styles.Table__Row_clickable} ${props.customRowClass}`} href={`/admin/user?id=${val.id}`}>      
                                                    {
                                                        Object.keys(val).map((key: string, j) => {
                                                            if (key.toLowerCase() == 'nationality') {
                                                                val = {...val, nationality: getNationality(val[key as keyof any], locale)?.name || val[key]}
                                                            }
                                                            return (
                                                                <td key={j} data-label={key} className={`${styles.Table__Cell} ${props.customCellClass}`}>{isDate(val[key])? createDatePatternFromDate(new Date(val[key])) : val[key]}</td>
                                                            );
                                                        })
                                                    }
                                            </Link>
                                        }
                                    </>
                                );
                            })
                        }
                        {
                            (props.tableData.length == 0) &&
                            <tr style={{color: "red"}}>{t("adminNoData")}</tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className={`${styles.Table__Footer}`}>
                <span>
                    {`${t("paginationNumber")}: ${props.numberOfItems || props.tableData.length} | ${t("paginationPage")}: ${props.currentPage+1}/${Math.ceil(props.numberOfItems / props.pageSize)}`}
                </span>
                <div className={`${styles.Table__Footer__Navbar}`}>
                    <SecondaryButton 
                        text={<RiArrowLeftSLine />}
                        type={'left'}
                        disabled={props.currentPage <= 0}
                        onClick={() => move(props.currentPage-1)}
                    />
                    <DropDown
                        setSelected={(e: number) => changeSize(e)}
                        setValue={(e: number) => changeSize(e)}
                        selected={props.pageSize}
                        data={props.paginationChoices}
                        buttonType={"center"}
                        customSelectorClass={styles.Table__Footer__Selector}
                    />
                    <SecondaryButton 
                        text={<RiArrowRightSLine />}
                        type={'right'}
                        disabled={props.currentPage >= ((props.numberOfItems || props.tableData.length) / props.pageSize)-1}
                        onClick={() => move(props.currentPage+1)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaginationTable;