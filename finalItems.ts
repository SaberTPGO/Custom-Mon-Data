export const Items: { [itemid: string]: any } = {
    negativeleftovers: {
        name: "Negative Leftovers", //TODO
    },
    snommunistbadge: {
        name: "Snommunist Badge", 
        fling: {
			basePower: 30,
			status: 'frz',
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Snom') {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Snom') {
				return this.chainModify(2);
			}
        },
        onModifySpePriority: 1,
		onModifySpe(spe, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Snom') {
				return this.chainModify(2);
			}
        },
		itemUser: ["Snom"],
    },
    staticorb: {
        name: "Static Orb",
        fling: {
			basePower: 30,
			status: 'par',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			pokemon.trySetStatus('par', pokemon);
		},
    },
    swiftorb: {
        name: "Swift Orb", //TODO
    },
    hazmatboots: {
        name: "Hazmat Boots",
        // airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
        // You need to do this on your file lol
    },
    vengefulgem: {
        name: "Vengeful Gem", //TODO
    },
    swiftbelt: {
        name: "Swift Belt",
        fling: {
			basePower: 10,
		},
		onModifyDamage(damage, source, target, move) {
			if (move && move.priority >= 1) {
				return this.chainModify([4915, 4096]);
			}
		},
    },
    analyticlens: {
        name: "Analytic Lens",
        fling: {
			basePower: 10,
		},
		onModifyAtkPriority: -2,
		onModifyAtk(atk, target) {
			if (!this.queue.willMove(target)) {
				this.debug('Analytic Lens boosting attack');
				return this.chainModify([4915, 4096]);
			}
        },
        onModifySpaPriority: -2,
		onModifySpa(spa, target) {
			if (!this.queue.willMove(target)) {
				this.debug('Analytic Lens boosting special attack');
				return this.chainModify([4915, 4096]);
			}
		},
    },
    berrycocktail: {
        name: "Berry Cocktail",
        fling: {
			basePower: 10,
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Spinda') {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Spinda') {
				return this.chainModify(2);
			}
        },
        onModifySpePriority: 1,
		onModifySpe(spe, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Spinda') {
				return this.chainModify(2);
			}
        },
        itemUser: ["Spinda"],
        isBerry: true,
    },
    comfortcharm: {
        name: "Comfort Charm", //TODO
    },
    woodenshield: {
        name: "Wooden Shield", //TODO
    },
    woodenglasses: {
        name: "Wooden Glasses", //TODO
    },
    assaultarmor: {
        name: "Assault Armor", //TODO
    },
    hustleorb: {
        name: "Hustle Orb", //TODO
    },
    bigfeather: {
        name: "Big Feather", //TODO
    },
    destructionscarf: {
        name: "Destruction Scarf", //TODO
    },
    weatherbulb: {
        name: "Weather Bulb", //TODO
    },
    defensepolicy: {
        name: "Defense Policy", //TODO
    },
    specialdefensepolicy: {
        name: "Special Defense Policy", //TODO
    },
};