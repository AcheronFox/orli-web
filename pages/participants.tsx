import styles from "@/styles/pages/Home.module.scss"
import { NextPage } from "next";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

type Codes = {
  id: number;
  alpha2: string;
  alpha3: string;
  name: string;
};

type Props = {}

const Participants: NextPage<Props> = (props: Props) => {
  const [Codes, setCodes] = useState<[Codes]>(
      require("../locales/EN.world.json")
  );
  
  return (
    <div className={styles.Home}>
      <br />
      <br />
      <br />
      Flag Test
      <br />
      {Codes.map((code, i) => {
        return (
          <> {i}
            <ReactCountryFlag key={i} style={{"margin": "1rem"}} countryCode={ code.alpha2 } svg />
          </>
        )
      })}
      <br />
      total: {Codes.length}
    </div>
  )
}

export default Participants;