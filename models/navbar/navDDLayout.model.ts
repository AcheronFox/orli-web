export default interface INavDDLayout {
    title: string
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    icon?: React.ReactElement
    iconPlacement?: 'left' | 'right' | 'both'
    click?: () => void
}