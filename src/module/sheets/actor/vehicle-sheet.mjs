import { ActorContainerSheet } from './actor-container-sheet.mjs';

export class VehicleSheet extends ActorContainerSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 1000,
            height: 750,
            resizable: true,
            tabs: [{ navSelector: '.rt-navigation', contentSelector: '.rt-body', initial: 'main' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/actor/actor-vehicle-sheet.hbs`;
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

}
