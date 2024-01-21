/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react"
import styles from "@/styles/components/navbar/NavItem.module.scss"
import Link from "next/link"
import { useRouter } from "next/router"
import { IconType } from "react-icons/lib"
import useRipple from "@/hooks/utils/useRipple"

interface Props {
  target?: React.HTMLAttributeAnchorTarget
  children: React.ReactNode
  linkTo: string
  isDropDownItem?: boolean
  className?: string
  activeClass?: string
  icon?: React.ReactElement<IconType>
  iconPlacement?: 'left' | 'right' | 'both'
  click?: () => void 
}

interface ContentProps {
  target?: React.HTMLAttributeAnchorTarget
  children: React.ReactNode
  isDropDownItem?: boolean
  className?: string
  activeClass?: string
  icon?: React.ReactElement<IconType>
  iconPlacement?: 'left' | 'right' | 'both'
  isActive: boolean
}

const NavContent = ({
  isActive,
  children,
  className,
  activeClass,
  isDropDownItem,
  icon,
  iconPlacement = 'left',
}: ContentProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const ripples = useRipple(itemRef)


  return (
    <div
      ref={itemRef}
      className={`
        ${styles.NavItem} ${className? className : ''}
        ${isActive? (activeClass ? activeClass : styles.NavItem__Active) : ''}
        ${isDropDownItem? styles.NavItem__DropDown : styles.NavItem__Default}
      `}
    >
      {ripples}
      <span
        className={styles.NavItem__Label}
      >
        {
          (icon != undefined && (iconPlacement == 'both' || iconPlacement == 'left')) &&
          icon
        }
        <span>{children}</span>
        {
          (icon != undefined && (iconPlacement == 'both' || iconPlacement == 'right')) &&
          icon
        }
      </span>
    </div>
  );
}

const NavItem = ({
    target,
    children,
    linkTo,
    className,
    activeClass,
    isDropDownItem,
    icon,
    iconPlacement = 'left',
    click,
  }: Props) => {
  const currentPath = useRouter();
  const [isActive, setIsActive] = useState<boolean>(false);


  useEffect(() => {
    if (currentPath.asPath.split("/")[1] == linkTo && (linkTo || target)) {
      setIsActive(true);
    } else {
      setIsActive(false)
    }
  }, [currentPath.asPath])


  return (
    <>
      {
        (linkTo || target)?
        <Link
          href={linkTo}
          target={target}
        >
          <NavContent
            isActive={isActive}
            className={className}
            activeClass={activeClass}
            isDropDownItem={isDropDownItem}
            icon={icon}
            iconPlacement={iconPlacement}
          >
            {children}
          </NavContent>
        </Link>
        :
        <a onClick={click? ()=>click() : undefined }>
          <NavContent
            isActive={isActive}
            className={className}
            activeClass={activeClass}
            isDropDownItem={isDropDownItem}
            icon={icon}
            iconPlacement={iconPlacement}
          >
            {children}
          </NavContent>
        </a>
      }
    </>
  )
}

export default NavItem
