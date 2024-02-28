interface INotification {
    id: string
    title: string
    description: string
    type: "error" | "notification" | "success"
    duration: number
}