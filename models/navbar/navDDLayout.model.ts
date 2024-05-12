export default interface INavDDLayout {
    style?: React.CSSProperties;
    title: string
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    icon?: React.ReactElement
    iconPlacement?: 'left' | 'right' | 'both'
    click?: () => void
}