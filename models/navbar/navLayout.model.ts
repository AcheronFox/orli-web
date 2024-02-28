import INavDDLayout from "./navDDLayout.model"

export default interface INavLayout {
    title: string | React.ReactNode
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    align?: 'left' | 'right' | 'center'
    icon?: React.ReactElement
    iconPlacement?: 'left' | 'right' | 'both'
    children?: INavDDLayout[]
    click?: () => void
}