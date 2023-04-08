/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Admin.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import { useContext, useEffect, useState } from "react";
import Router from "next/router";
import LoadingOverlay from "@/comp/LoadingOverlay";
import CustomHead from "@/comp/CustomHead";
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext";
import axiosInstance from "@/utils/axiosConfig";
import PaginationTable from "@/comp/PaginationTable";


type Props = {}

const Admin: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit } = useUser();
  const { HandleClose, AddFloatingMessage } = useContext(FloatingMessageContext);

  const [headerData, setHeaderData] = useState<Array<string>>()
  const [tableData, setTableData] = useState<Array<Object>>()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isAuthenTicated, setIsAuthenticated] = useState<boolean>(false)

  let timer: NodeJS.Timeout | undefined = undefined;
  let time = 0;
  let message: number | undefined = undefined;
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
      console.log(err)
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
    await axiosInstance.post(`/api/admin/search-account`, {pageSize: 10, currentPage: 0})
    .then((res) => {
      setTableData(res.data)
      setHeaderData(Object.keys(res.data[0]))
    })
    .catch((err) => console.log(err))
  }

  // ===============================================
  // BACKEND
  // ===============================================
  const startTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      time = time + 100;
      if (time >= 6000) showOverload();
    }, 100);
  };

  const showOverload = () => {
    clearInterval(timer);
    message = AddFloatingMessage({"autocloses": false, "closable": false, "type": "Info", "message": t("warnOverload")})
  };
  const closeOverload = () => {
    clearInterval(timer);
    HandleClose(message!)
  };


  return (
    <>
      <CustomHead title={t("navAdmin")} />
      <LoadingOverlay isLoading={isLoading} />
      <div className={styles.Admin}>
        {
          (user && user.isAdmin) &&
          <div className={styles.Admin__Content}>
            <PaginationTable
              columnData={headerData}
              tableData={tableData}
              />
          </div>
        }
      </div>
    </>
  )
}

export default Admin;