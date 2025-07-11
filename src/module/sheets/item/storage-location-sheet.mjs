import { DarkHeresyItemContainerSheet } from './item-container-sheet.mjs';

export class DarkHeresyStorageLocationSheet extends DarkHeresyItemContainerSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 800,
            height: 400,
            tabs: [{ navSelector: '.dh-navigation', contentSelector: '.dh-body', initial: 'items' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/item/item-storage-location-sheet.hbs`;
    }
}
