import styles from "@/styles/pages/Faq.module.scss"
import { NextPage } from "next";
import React, { useState } from "react";
import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import TextCard from "@/comp/TextCard";
import { RiAccountBoxFill, RiAccountCircleFill, RiAccountPinBoxFill, RiAiGenerate, RiAlertLine, RiAlignJustify, RiAnchorLine, RiAnticlockwiseLine, RiQuestionLine, RiSearch2Line } from "react-icons/ri";
import { IFAQ } from "@/models/locale/faq.model";
import Input from "@/comp/input/Input";
import IconButton from "@/comp/button/IconButton";
import { IconType } from "react-icons";
import { useHTMLString } from "@/hooks/utils/useHTMLString";


type Props = {}
const icons: React.ReactElement<IconType>[] = [
  <RiAccountBoxFill key={0} />,
  <RiAccountCircleFill key={1} />,
  <RiAccountPinBoxFill key={2} />,
  <RiAiGenerate key={3} />,
  <RiAlertLine key={4} />,
  <RiAnchorLine key={5} />,
  <RiAlignJustify key={6} />,
  <RiAnticlockwiseLine key={7} />
]

const FAQ: NextPage<Props> = (props: Props) => {
  const [searchParam, setSearchParam] = useState<string>('')

  const { lang, currLang } = useTranslate();
  const data: IFAQ = useLocaleSwitch(currLang, 'faq.ts')
  const parse = useHTMLString()

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
              <RiSearch2Line />
            }
            value={searchParam}
            onChange={(val) => setSearchParam(val)}
          />
        </TextCard>
        <TextCard
          variant={searchParam==''? 'filled' : 'contained'}
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
                            const str = v+'<br/>'
                            return parse(str) 
                          })}
                          <br/>
                          <br/>
                          <br/>
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