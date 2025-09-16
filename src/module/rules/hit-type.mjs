export function voidshipHitTypeDropdown() {
    const dropdown = {};
    voidshipHitType().forEach((i) => {
        dropdown[i.name] = i.name;
    });
    return dropdown;
}

export function voidshipHitTypeNames() {
    return voidshipHitType().map((i) => i.name);
}

export function voidshipHitType() {
    return [
        {
            name: 'Overpenetrating Hit',
        },
        {
            name: 'Penetrating Hit',
        },
        {
            name: 'Overpenetrating Critical Hit',
        },
        {
            name: 'Penetrating Critical Hit',
        },
        {
            name: 'Nonpenetrating Critical Hit',
        },
    ];
}
