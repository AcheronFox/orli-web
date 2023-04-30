/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/AdminSearch.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Router from "next/router";
import { useRouter } from 'next/router'
import LoadingOverlay from "@/comp/LoadingOverlay";
import CustomHead from "@/comp/CustomHead";
import axiosInstance from "@/utils/axiosConfig";
import PaginationTable from "@/comp/PaginationTable";
import { ISearchQuery, defaultSearchQuery } from "@/models/admin.model";
import Input from "@/comp/Input";
import NationalitySelector from "@/comp/NationalitySelector";
import CustomDatePicker from "@/comp/CustomDatePicker";
import DropDown from "@/comp/DropDown";
import SecondaryButton from "@/comp/SecondaryButton";
import CustomBackground from "@/comp/CustomBackground";


type Props = {}

const AdminSearch: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();
    const { user, didUserInit } = useUser();
    const routerQuery = useRouter()?.query

    const [headerData, setHeaderData] = useState<Array<string>>()
    const [tableData, setTableData] = useState<Array<Object>>()
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [numberOfItems, setNumberOfItems] = useState<number>(0)
    const [paginationChoices] = useState<Array<number>>([
        5,
        10,
        20,
        50,
        100,
        200
    ])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAuthenTicated, setIsAuthenticated] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<ISearchQuery>(routerQuery.query? (JSON.parse(routerQuery.query.toString())) : defaultSearchQuery)
    const paymentMethods = [
        'MKB',
        'Paypal',
        'Revolut',
    ]


    interface stateTable {
        "pageSize": Dispatch<SetStateAction<number>>,
        "currentPage": Dispatch<SetStateAction<number>>,
        "query": Dispatch<SetStateAction<ISearchQuery>>,
    }
    const setStateTable: stateTable = {
        "pageSize": setPageSize,
        "currentPage": setCurrentPage,
        "query": setSearchQuery,
   }
   const stateNameTable = {
        "pageSize": pageSize,
        "currentPage": currentPage,
        "query": searchQuery
    }

    let abortController = new AbortController();

    useEffect(() => {
        if (!didUserInit) return
        if (!user || !user.isAdmin) {
            Router.push('/')
        }
        else if (user && user.isAdmin) {
            runAuth()
        }
    }, [didUserInit])

    // ===============================================
    // AUTHENTICATION
    // ===============================================
    const runAuth = async () => {
        await axiosInstance.get(`/api/admin/auth`)
            .then((res) => {
                setIsAuthenticated(res.data)
                getDefaults()
            })
            .catch((err) => {
                setIsAuthenticated(false)
                Router.push('/')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    // ===============================================
    // DATA
    // ===============================================
    const getDefaults = async () => {
        abortController = new AbortController()
        
        setIsLoading(true)
        await axiosInstance.post(`/api/admin/search-account`, { pageSize: pageSize, currentPage: currentPage, searchQuery: searchQuery }, {signal: abortController.signal})
            .then((res) => {
                setNumberOfItems(res.data.count)
                setTableData(res.data.data)
                if (res.data.data[0]) {
                    setHeaderData(Object.keys(res.data.data[0]))
                }
                else {
                    setHeaderData([])
                }
            })
            .catch((err) => {
                if (err.code == 'ERR_CANCELED') return
                else {
                    return
                }
            })
            .finally(() => {
                setIsLoading(false)
                
            })
    }

    useEffect(() => {
        const isJSON = (str: string) => {
            try {
                return (JSON.parse(str));
            } catch (e) {
                return false;
            }
        }

        Object.keys(routerQuery).map((item) => {
            const key: any = item as any
            if (isJSON(routerQuery[key as keyof typeof routerQuery]!.toString()) != false) {
                setStateTable[key as keyof typeof setStateTable](JSON.parse(routerQuery[key] as unknown as any))
            }
            else if (typeof Number(stateNameTable[key as keyof typeof stateNameTable]) == 'number') {
                setStateTable[key as keyof typeof setStateTable](Number(routerQuery[key]) as any)
            }
            else {
                setStateTable[key as keyof typeof setStateTable](routerQuery[key] as unknown as any)
            }
       });
       getDefaults()

        return () => {
            abortController.abort()
        }
    }, [routerQuery])

    useEffect(() => {
        const query = JSON.stringify(searchQuery)
        if ((query == routerQuery.query) && (pageSize.toString() == routerQuery.pageSize) && (currentPage.toString() == routerQuery.currentPage)) return

        Router.push({
            pathname: '/admin/search',
            query: {
                pageSize,
                currentPage,
                query,
            },
        })
    }, [currentPage, pageSize, searchQuery])

    const updateState = (state: any, key: string, value: any) => {
        state((val: any) => { return { ...val, [key]: value } });
    }


    return (
        <>
            <CustomHead title={t("adminNavSearch")} />
            <LoadingOverlay isLoading={isLoading} />
            <CustomBackground />
            <div className={styles.Admin}>
                {
                    (user && user.isAdmin && isAuthenTicated && tableData && headerData) &&
                    <div className={styles.Admin__Content}>
                        <div className={styles.Admin__Content__Search}>
                            <div className={styles.Admin__Content__Row}>
                                <Input
                                    id={"in-1"}
                                    label={`${t("regFirstname")}: `}
                                    placeholder={t("regFirstname")}
                                    list="autoCompleteOff"
                                    autoComplete="nope"
                                    value={searchQuery.firstName}
                                    onChange={(e) => updateState(setSearchQuery, 'firstName', e.target.value)}
                                    maxlength={255}
                                ></Input>
                                <Input
                                    id={"in-2"}
                                    label={`${t("regLastname")}: `}
                                    placeholder={t("regLastname")}
                                    list="autoCompleteOff"
                                    autoComplete="nope"
                                    value={searchQuery.lastName}
                                    onChange={(e) => updateState(setSearchQuery, 'lastName', e.target.value)}
                                    maxlength={255}
                                ></Input>
                                <Input
                                    id={"in-3"}
                                    label={`${t("regEmail")}: `}
                                    placeholder={t("regEmail")}
                                    list="autoCompleteOff"
                                    autoComplete="nope"
                                    value={searchQuery.email}
                                    onChange={(e) => updateState(setSearchQuery, 'email', e.target.value)}
                                    maxlength={255}
                                ></Input>
                            </div>
                            <div className={styles.Admin__Content__Row}>
                                <NationalitySelector
                                    label={`${t("regNationality")}: `}
                                    onChange={(e) => updateState(setSearchQuery, 'nationality', e.toString())}
                                    value={searchQuery.nationality}
                                ></NationalitySelector>
                                <CustomDatePicker
                                    label={`${t("regDob")}: `}
                                    onChange={(e: React.SetStateAction<string>) => updateState(setSearchQuery, 'dateOfBirth', e.toString())}
                                    value={searchQuery.dateOfBirth}
                                    isDateValid={(e: any) => {}}
                                ></CustomDatePicker>
                                <Input
                                    id={"in-4"}
                                    label={`${t("adminAge")}: `}
                                    placeholder={t("adminAge")}
                                    type="number"
                                    value={searchQuery.age}
                                    onChange={(e) => updateState(setSearchQuery, 'age', parseInt(e.target.value))}
                                    min={0}
                                    max={200}
                                    maxlength={255}
                                ></Input>
                            </div>
                            <div className={styles.Admin__Content__Row}>
                                <Input
                                    type="checkbox"
                                    checked={(e) => updateState(setSearchQuery, 'isPaid', e? 1 : undefined)}
                                    id="chk-1"
                                    label={t("adminPaidTrue")}
                                ></Input>
                                <Input
                                    type="checkbox"
                                    checked={(e) => updateState(setSearchQuery, 'isPaid', e? 0 : undefined)}
                                    id="chk-2"
                                    label={t("adminPaidFalse")}
                                ></Input>
                                <DropDown
                                    label={`${t("adminPaymentMethod")}:`}
                                    buttonPlaceholder={t("natSelectSelect")}
                                    data={paymentMethods}
                                    onChange={(e: string) => updateState(setSearchQuery, 'paymentMethod', e)}
                                    selected={searchQuery.paymentMethod}
                                    setSelected={(e: string) => updateState(setSearchQuery, 'paymentMethod', e)}
                                    setValue={(e: string) => updateState(setSearchQuery, 'paymentMethod', e)}
                                />
                            </div>
                            <div className={styles.Admin__Content__Row}>
                                <Input
                                    type="checkbox"
                                    checked={(e) => updateState(setSearchQuery, 'isVerified', e? 1 : undefined)}
                                    id="chk-3"
                                    label={t("adminVerified")}
                                ></Input>
                                <Input
                                    type="checkbox"
                                    checked={(e) => updateState(setSearchQuery, 'isVerified', e? 0 : undefined)}
                                    id="chk-4"
                                    label={t("adminUnverified")}
                                ></Input>
                                <SecondaryButton
                                    text={t("adminReset")}
                                    onClick={() => setSearchQuery(defaultSearchQuery)}
                                />
                            </div>
                            <div className={styles.Admin__Content__Row}>
                                
                            </div>
                        </div>
                        <PaginationTable
                            columnData={headerData}
                            tableData={tableData}
                            onPageSizeChange={(e: number) => setPageSize(e)}
                            onPageMove={(e: number) => setCurrentPage(e)}
                            numberOfItems={numberOfItems}
                            paginationChoices={paginationChoices}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onRowClick={(e: number) => Router.push({
                                pathname: '/admin/user',
                                query: {
                                    id: e
                                },
                            })}
                        />
                    </div>
                }
            </div>
        </>
    )
}

export default AdminSearch;