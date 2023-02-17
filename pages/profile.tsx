import styles from "@/styles/pages/Profile.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";

type Props = {}

const Profile: NextPage<Props> = (props: Props) => {
  const { t } = useTranslate();
  const { user } = useUser();

  if (!user) return (<div></div>)

  return (
    <div className={styles.Profile}>
      <div className={styles.Profile__Content}>
        <section className={styles.Profile__Header}>
          <div className={styles.Profile__Header__Picture}>
            <picture>
                <source srcSet={`${user.picture? (`uploads/${user.picture.split('.')[0]}_x1.jpg 1x, uploads/${user.picture.split('.')[0]}_x2.jpg 2x`) : 'Default_profile_x1.jpg 1x, Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                <img srcSet={`${user.picture? (`uploads/${user.picture.split('.')[0]}_x1.jpg 1x, uploads/${user.picture.split('.')[0]}_x2.jpg 2x`) : 'Default_profile_x1.jpg 1x, Default_profile_x2.jpg 2x,'}`} alt="Participant Picture" src="Default_profile_x2.jpg" />
            </picture>
          </div>
          <div className={styles.Profile__Header__Content}>
            <div className={styles.Profile__Header__Top}>
              <div className={styles.Profile__Header__Title}>
                <h2>
                  {user.fursonaName}
                </h2>
                <h3>
                  {user.fursonaSpecies}
                </h3>
              </div>
              { (user.isFursuiter == true || user.SponsorLevel > 0) &&
                <div className={styles.Profile__Header__Badges}>
                  {
                    (user.isFursuiter == true) &&
                    <Tippy className={styles.Tooltip} content={t("partSuiter")}>
                        <span>
                            <FursuiterIcon style={{"fill": "#F741D5"}} />
                        </span>
                    </Tippy>
                  }
                  {
                    (user.SponsorLevel > 0) &&
                    <Tippy className={styles.Tooltip} content={t("partSponsor")}>
                        <span>
                            <SponsorIcon style={{"fill": "#F741D5"}} />
                        </span>
                    </Tippy>
                  }
                </div>
              }
            </div>
            <div className={styles.Profile__Header__Bottom}>
              <SecondaryButton type="left" text={"Upload Picture"} onClick={() => {}} />
              <SecondaryButton type="center" text={"Tickets"} onClick={() => {}} />
              <SecondaryButton type="right" text={"Rooms"} onClick={() => {}} />
            </div>
          </div>
        </section>
        <section className={styles.Profile__Body}>
          <div>
            body left
          </div>
          <div>
            body right
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile;