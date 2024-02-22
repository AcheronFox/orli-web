import styles from "@/styles/pages/legal/Legal.module.scss"
import { RiDatabase2Line, RiFileList3Line } from "react-icons/ri";
import { NextPage } from "next";
import CustomHead from "@/comp/utils/CustomHead";
import IconButton from "@/comp/button/IconButton";
import useTranslate from "@/hooks/translate/useTranslate";

type Props = {}

const Legal: NextPage<Props> = (props: Props) => {
  const { lang } = useTranslate();

  return (
    <>
      <CustomHead title={lang.navLegal} />
      <div className={styles.Legal__Background} />
      <div className={styles.Legal}>
        <IconButton
          size="10rem"
          link="/legal/rules"
          tooltip={lang.legalRules}
          tooltipVariant="internal"
          variant="contained"
        >
          <RiFileList3Line />
        </IconButton>

        <IconButton
          size="10rem" 
          link="/legal/data"
          tooltip={lang.legalData}
          tooltipVariant="internal"
          variant="contained"
        >
          <RiDatabase2Line />
        </IconButton>
      </div>
    </>
  )
}

export default Legal;
