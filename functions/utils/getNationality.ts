type Codes = {
    id: number;
    alpha2: string;
    alpha3: string;
    name: string;
};

const getNationality = (input: string, locale: string) => {
    const Codes: Codes[] = (
        locale == "en"
            ? require("../locales/en.world.json")
            : require("../locales/hu.world.json")
    );

    const val = Codes.find((o) => o.alpha2 == input)
    
    if (val) return val;
    return undefined;
}

export default getNationality