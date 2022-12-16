import styles from "@/styles/pages/Info.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import Section from "@/comp/Section";

export default function Info() {
  const { t } = useTranslate();

  return (
    <>
      <a id="tos"></a>
      <div className={styles.MainWrapper}>
        <div className={styles.Title}>
          <h1>
            Info
          </h1>
        </div>
        <div className={styles.Location}>
          <Section
            title={t("navTos")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
          </Section>
          <Section
            id="rules"
            title={t("navRules")}
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim voluptate ullam perferendis eligendi dicta debitis, molestias, quia assumenda, temporibus reiciendis facilis aspernatur. Neque esse dolore debitis eos tempora expedita optio!"
          >
          </Section>
          <Section
            id="data"
            title={t("navData")}
            text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo, iste aut, fuga, vero at et eius beatae voluptate a nam dolores nesciunt placeat quos atque incidunt accusantium ad ipsa fugiat?"
          >
          </Section>
        </div>
      </div>
    </>
  )
}
