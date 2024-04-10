/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Faq.module.scss"
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import TextCard from "@/comp/TextCard";
import { RiUserAddFill, RiMoneyEuroBoxFill, RiHotelBedFill, RiMapPin2Fill, RiQuestionLine, RiSearch2Line, RiQuestionFill } from "react-icons/ri";
import { IFAQ } from "@/models/locale/faq.model";
import Input from "@/comp/input/Input";
import IconButton from "@/comp/button/IconButton";
import { IconType } from "react-icons";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
import { useDebounceValue } from "usehooks-ts";
import PuffLoader from "react-spinners/PuffLoader";
import variables from "@/styles/abstracts/exports.module.scss"


type Props = {}
const icons: React.ReactElement<IconType>[] = [
  <RiQuestionFill key={0} />,
  <RiUserAddFill key={1} />,
  <RiMoneyEuroBoxFill key={2} />,
  <RiHotelBedFill key={3} />,
  <RiMapPin2Fill key={4} />,
]

const FAQ: NextPage<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [didInit, setDidInit] = useState<boolean>(false)
  const [tempSearchParam, setTempSearchParam] = useState<string>('')
  const [searchParam, setSearchParam] = useDebounceValue<string>('', 500)

  const { lang, currLang } = useTranslate();
  const data: IFAQ = useLocaleSwitch(currLang, 'faq.ts')
  const parse = useHTMLString()

  useEffect(() => {
    if (didInit) {
      setIsLoading(true)
      setSearchParam(tempSearchParam);
    }
  }, [tempSearchParam])

  useEffect(() => {
    if (didInit) {
      setIsLoading(false);
    }
  }, [searchParam])

  useEffect(() => {
    setDidInit(true)
  }, [])

  return (
    <>
      <CustomHead title={lang.navFaq} />
      <div className={styles.Faq__Background} />
      <div className={styles.Faq}>
        <TextCard
          variant="filled"
          shadowEnabled
          title={lang.navFaq}
          customTitleClass={styles.Faq__Title__Main}
          icon={<RiQuestionLine />}
        >
          {lang.faqIntro}
          <br />
          <Input
            label={lang.faqSearch}
            startAdornment={
              (isLoading == true)
              ?<PuffLoader color={variables.primaryColor} size={"1.6rem"} />
              :<RiSearch2Line />
            }
            value={tempSearchParam}
            onChange={(val) => setTempSearchParam(val)}
          />
        </TextCard>
        <TextCard
          variant={searchParam == '' ? 'filled' : 'contained'}
          shadowEnabled
          customBodyClass={
            (searchParam == '')
              ? styles.Faq__Categories
              : styles.Faq__Search
          }
        >
          {
            ((data != undefined) && (searchParam == '')) &&
            Object.entries(data).map((o, i) => {
              const key = o[0]
              const content = o[1]

              return (
                <IconButton
                  key={i}
                  link={`faq/${key}`}
                  variant="contained"
                  tooltip={content.translation}
                  tooltipVariant="internal"
                  size="10rem"
                >
                  {icons[i]}
                </IconButton>
              )
            })
          }
          {
            (searchParam != '') &&
            Object.values(data).map((o) => {
              return o.data.map((p, i) => {
                if (p.content.filter((o) => o.toLowerCase().includes(searchParam)).length || p.title.toLowerCase().includes(searchParam)) {
                  return (
                    <div
                      key={i}
                      className={styles.Faq__Search__Item}
                    >
                      <TextCard
                        variant="simple"
                        customBodyClass={styles.Faq__Body}
                        customTitleClass={styles.Faq__Title}
                        title={
                          <h4>{parse(p.title)}</h4>
                        }
                      >
                        {p.content.map((v) => {
                          const str = v + '<br/>'
                          return parse(str)
                        })}
                        <br />
                        <br />
                        <br />
                      </TextCard>
                    </div>
                  );
                }
                else return null
              })
            })
          }
        </TextCard>
      </div>
    </>
  )
}

export default FAQ;