import { ActorContainerSheet } from './actor-container-sheet.mjs';

export class VoidshipSheet extends ActorContainerSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 1000,
            height: 750,
            resizable: true,
            tabs: [{ navSelector: '.rt-navigation', contentSelector: '.rt-body', initial: 'main' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/actor/actor-voidship-sheet.hbs`;
    }

    getData() {
        const context = super.getData();
        context.rt = CONFIG.rt;
        const items = this.actor.items;
        const sortedItems = Array.from(items).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
        context.items = sortedItems;
        return context;
    }

    async _onItemDamage(event) {
        event.preventDefault();
        const div = $(event.currentTarget);
        game.rt.warn('Not Implemented for Vehicles Yet');
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
