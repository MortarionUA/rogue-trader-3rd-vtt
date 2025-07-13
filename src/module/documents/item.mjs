import { RogueTraderItemContainer } from './item-container.mjs';
import { capitalize } from '../handlebars/handlebars-helpers.mjs';

export class RogueTraderItem extends RogueTraderItemContainer {
    get totalWeight() {
        let weight = this.system.weight || 0;
        if (this.items && this.items.size > 0) {
            this.items.forEach((item) => (weight += item.totalWeight));
        }
        return weight;
    }

    get equipped() {
        return !!this.system.equipped;
    }

    get isMentalDisorder() {
        return this.type === 'mentalDisorder';
    }

    get isMalignancy() {
        return this.type === 'malignancy';
    }

    get isMutation() {
        return this.type === 'mutation';
    }

    get isTalent() {
        return this.type === 'talent';
    }

    get isTrait() {
        return this.type === 'trait';
    }

    get isAptitude() {
        return this.type === 'aptitude';
    }

    get isSpecialAbility() {
        return this.type === 'specialAbility';
    }

    get isPsychicPower() {
        return this.type === 'psychicPower';
    }

    get isPsychicBarrage() {
        return this.type === 'psychicPower' && this.system.attackType === 'Psychic Barrage';
    }

    get isPsychicStorm() {
        return this.type === 'psychicPower' && this.system.attackType === 'Psychic Storm';
    }

    get isCriticalInjury() {
        return this.type === 'criticalInjury';
    }

    get isWeapon() {
        return this.type === 'weapon';
    }

    get isShipWeapon() {
        return this.type === 'shipWeapon';
    }

    get isShipComponent() {
        return this.type === 'shipComponent';
    }

    get isRanged() {
        return this.type === 'weapon' && this.system.class.toLowerCase() !== 'melee';
    }

    get isThrown() {
        return this.type === 'weapon' && this.system.class.toLowerCase() === 'thrown';
    }

    get usesAmmo() {
        return this.isRanged && this.system.reload && this.system.reload !== 'N/A';
    }

    get isMelee() {
        return this.type === 'weapon' && this.system.class.toLowerCase() === 'melee';
    }

    get isArmour() {
        return this.type === 'armour';
    }

    get isArmourModification() {
        return this.type === 'armourModification';
    }

    get isGear() {
        return this.type === 'gear' || this.isConsumable || this.isDrug || this.isAmmunition || this.isTool;
    }

    get isDrug() {
        return this.type === 'drug';
    }

    get isConsumable() {
        return this.type === 'consumable';
    }

    get isTool() {
        return this.type === 'tool';
    }

    get isCybernetic() {
        return this.type === 'cybernetic';
    }

    get isWeaponModification() {
        return this.type === 'weaponModification';
    }

    get isAmmunition() {
        return this.type === 'ammunition';
    }

    get isForceField() {
        return this.type === 'forceField';
    }

    get isAttackSpecial() {
        return this.type === 'attackSpecial';
    }

    get isStorageLocation() {
        return this.type === 'storageLocation';
    }

    get isBackpack() {
        return this.type === 'backpack';
    }

    get isInBackpack() {
        return this.system.backpack?.inBackpack || false;
    }

    get isJournalEntry() {
        return this.type === 'journalEntry';
    }

    get isEnemy() {
        return this.type === 'enemy';
    }

    get isPeer() {
        return this.type === 'peer';
    }

    get isShipComponent() {
        return this.type === 'shipComponent';
    }

    get isShipWeapon() {
        return this.type === 'shipWeapon';
    }

    _onCreate(data, options, user) {
        game.rt.log('Determining nested items for', this);
        this._determineNestedItems();
        return super._onCreate(data, options, user);
    }

    async prepareData() {
        super.prepareData();
        game.rt.log('Item prepare data', this);

        this.convertNestedToItems();

        if (this.isPsychicPower) {
            if(!this.system.damage || this.system.damage === '') {
                this.system.damage = 0;
            }
            if(!this.system.penetration || this.system.penetration === '') {
                this.system.penetration = 0;
            }
        }

        // Fix Broken Selects
        if(!this.system.craftsmanship || this.system.craftsmanship === '') {
            this.system.craftsmanship = 'Common';
        }
        if(!this.system.availability || this.system.availability === '') {
            this.system.availability = 'Common';
        }
    }

    /**
     * This unlocks and loads nested items dynamically from the adjacent compendium.
     * I tried to find another way to do this but couldn't find anything online - I made my own hack.
     */
    async _determineNestedItems() {
        // Already has items just skip
        if ((this.items && this.items.size > 0) || this.hasNested()) return;

        // Check for specials
        if (this.system.special) {
            game.rt.log('Performing first time nested item configuration for item: ' + this.name + ' with specials: ', this.system.special);
            if (this.isWeapon) await this._updateSpecialsFromPack('rogue-trader-3rd.weapons', this.system.special);
            if (this.isAmmunition) await this._updateSpecialsFromPack('rogue-trader-3rd.ammo', this.system.special);
            game.rt.log('Special migrated for item: ' + this.name, this.system.special);
            this.system.special = undefined;

            await this.convertNestedToItems();
        }
    }

    async _updateSpecialsFromPack(pack, data) {
        const compendium = game.packs.find((p) => p.collection === pack);
        if (!compendium) return;
        await compendium.configure({ locked: false });
        const attackSpecials = await this._getAttackSpecials(data);
        if (attackSpecials.length > 0) {
            await this.createNestedDocuments(attackSpecials);
        }
        await compendium.configure({ locked: true });
    }

    async _getAttackSpecials(specialData) {
        const attackSpecialPack = game.packs.find((p) => p.collection === 'rogue-trader-3rd.attack-specials');
        if (!attackSpecialPack) return;
        const index = await attackSpecialPack.getIndex({ fields: ['name', 'img', 'type', 'system'] });
        const specials = [];
        for (const special of Object.keys(specialData)) {
            const specialName = capitalize(special);
            const attackSpecial = index.find((n) => n.name === specialName);
            if (attackSpecial) {
                if (attackSpecial.system.hasLevel) {
                    attackSpecial.system.level = specialData[special];
                } else {
                    attackSpecial.system.enabled = specialData[special];
                }
                specials.push(attackSpecial);
            }
        }
        return specials;
    }
}
