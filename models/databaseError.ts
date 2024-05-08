class DatabaseError extends Error {
    public return_code: number;
    public e_code: string;

    constructor(return_code: number, message: string, e_code: string) {
        super(message);
        this.return_code = return_code;
        this.e_code = e_code;
        this.name = "DatabaseError";
    }
}
