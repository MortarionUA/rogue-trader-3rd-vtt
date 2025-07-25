import { DarkHeresyItemContainerSheet } from './item-container-sheet.mjs';

export class DarkHeresyAmmoSheet extends DarkHeresyItemContainerSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 820,
            height: 575,
            tabs: [{ navSelector: '.rt-navigation', contentSelector: '.rt-body', initial: 'stats' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/item/item-ammo-sheet.hbs`;
    }

    canAdd(itemData) {
        if (!super.canAdd(itemData)) {
            return false;
        }
        // Every item can only be added once for weapons
        if (this.item.items?.some((i) => i.name === itemData.name)) {
            ui.notifications.info('Ammo can only hold one ' + itemData.name);
            return false;
        }
        return true;
    }
}
