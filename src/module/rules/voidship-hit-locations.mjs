export function voidshipHitLocationDropdown() {
    const dropdown = {};
    voidshipHitLocation().forEach((i) => {
        dropdown[i.name] = i.name;
    });
    return dropdown;
}

export function voidshipHitLocationNames() {
    return voidshipHitLocation().map((i) => i.name);
}

export function voidshipHitLocation() {
    return [
        {
            name: 'Main',
        },
        {
            name: 'Prow',
        },
        {
            name: 'Bridge',
        },
        {
            name: 'Rear',
        },
    ];
}
