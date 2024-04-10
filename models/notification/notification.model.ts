interface INotification {
    id?: string
    title?: string
    message: string
    type?: "error" | "info" | "success" | "warning"
    duration?: number
    autoClose?: boolean
    closable?: boolean
    ref?: React.MutableRefObject<any>
}