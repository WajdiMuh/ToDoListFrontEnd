export enum StoreType {
    Grocery,
    Cosmetics,
    Miscellaneous
}

let StoreTypeIcon: Map<StoreType, string> = new Map<StoreType, string>([
    [StoreType.Grocery, "../assets/grocery.svg"],
    [StoreType.Cosmetics, "../assets/cosmetics.svg"],
    [StoreType.Miscellaneous, "../assets/miscellaneous.svg"],
]);

export {StoreTypeIcon};