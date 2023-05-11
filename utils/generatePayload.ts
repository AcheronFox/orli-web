import { DatabaseSuperClass } from "@/models/database.model";
import _ from "lodash";

const generatePayload = (className: new() => DatabaseSuperClass, query: any) => {
    let temp = new className()
    _.assign(temp , _.pick(query, _.keys(temp)));
    Object.keys(temp).forEach((key) => {
        if(temp[key as keyof typeof temp] === '') {
            (temp[key as keyof typeof temp] as any) = undefined;
        }
    })
    temp = JSON.parse(JSON.stringify(temp))
    return temp
}

export default generatePayload