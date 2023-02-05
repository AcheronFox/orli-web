import styles from "@/styles/pages/Legal.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";
import { NextPage } from "next";

type Props = {}

const Rules: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();

  return (
    <>
      <div className={styles.MainWrapper}>
        <div className={styles.Content}>
          <Section
            title={t("legalRules")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
          </Section>
        </div>
      </div>
    </>
  )
}

export default Rules;