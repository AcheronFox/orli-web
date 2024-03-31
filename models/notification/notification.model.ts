interface INotification {
    id?: string
    title: string
    description: string
    type?: "error" | "info" | "success" | "warning"
    duration?: number
}