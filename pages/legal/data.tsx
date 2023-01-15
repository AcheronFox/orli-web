import styles from "@/styles/pages/Legal.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";

export default function Data() {
  const { t } = useTranslate();

  return (
    <>
      <div className={styles.MainWrapper}>
        <div className={styles.Content}>
          <Section
            title={t("legalData")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
          </Section>
        </div>
      </div>
    </>
  )
}
