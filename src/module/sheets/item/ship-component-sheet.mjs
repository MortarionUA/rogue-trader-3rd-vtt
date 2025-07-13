import { DarkHeresyItemSheet } from './item-sheet.mjs';

export class DarkHeresyShipComponentSheet extends DarkHeresyItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 820,
            height: 575,
            tabs: [{ navSelector: '.rt-navigation', contentSelector: '.rt-body', initial: 'stats' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/item/item-ship-component-sheet.hbs`;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find("input[type='checkbox'][name^='items.']").on("change", async (event) => {
            const input = event.currentTarget;
            const itemId = input.name.split(".")[1];
            const path = input.name.split(".").slice(2).join(".");
            const checked = input.checked;

            const item = this.actor.items.get(itemId);
            if (!item) return;

            await item.update({ [`system.${path.split("system.")[1]}`]: checked });
        });
    }
}
