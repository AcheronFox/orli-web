import { NextPage } from "next";
import React from "react";
import style from "@/styles/components/Separator.module.scss";


type Props = {
  IconComp: JSX.Element,
  placement?: "left" | "right" | "both";
  text?: string;
};

const Separator: NextPage<Props> = ({
  IconComp,
  placement = "left",
  text = "Örli",
}: Props) => {
  const iconWrapper = () => (<div className={style.Separator__Middle__Icon}>{IconComp}</div>)

  return (
    <div className={style.Separator}>
      <div className={style.Separator__Left}></div>
        <div className={style.Separator__Middle}>
          {IconComp && (placement == "left" || placement == "both")
          && iconWrapper()}
            <span className={style.Separator__Text}>{text}</span>
          {IconComp && (placement == "right" || placement == "both")
          && iconWrapper()}
        </div>
      <div className={style.Separator__Right}></div>
    </div>
  );
};

export default Separator;
