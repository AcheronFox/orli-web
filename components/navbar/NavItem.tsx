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
  onClick?: () => void
  style?: React.CSSProperties
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
  style?: React.CSSProperties
}

const NavContent = ({
  isActive,
  children,
  className,
  activeClass,
  isDropDownItem,
  icon,
  iconPlacement = 'left',
  style,
}: ContentProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const ripples = useRipple(itemRef)

  return (
    <div
      style={style}
      ref={itemRef}
      className={`
        ${styles.NavItem} ${className? className : ''}
        ${(isActive && !isDropDownItem)? (activeClass ? activeClass : styles.NavItem__Active) : ''}
        ${isDropDownItem? styles.NavItem__DropDown : styles.NavItem__Default}
        ${(isActive && isDropDownItem)? styles.NavItem__DropDown__Active : ''}
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
    onClick,
    style,
  }: Props) => {
  const currentPath = useRouter();
  const [isActive, setIsActive] = useState<boolean>(false);


  useEffect(() => {
    if (currentPath.asPath.split(/\/(.*)/s)[1] == linkTo.replace('/', "") && (linkTo || target)) {
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
          onClick={() => {
            onClick? onClick() : undefined;
          }}
        >
          <NavContent
            isActive={isActive}
            className={className}
            activeClass={activeClass}
            isDropDownItem={isDropDownItem}
            icon={icon}
            iconPlacement={iconPlacement}
            style={style}
          >
            {children}
          </NavContent>
        </Link>
        :
        <a onClick={() => {
          click? click() : undefined;
          onClick? onClick() : undefined;
        }}>
          <NavContent
            isActive={isActive}
            className={className}
            activeClass={activeClass}
            isDropDownItem={isDropDownItem}
            icon={icon}
            iconPlacement={iconPlacement}
            style={style}
          >
            {children}
          </NavContent>
        </a>
      }
    </>
  )
}

export default NavItem
