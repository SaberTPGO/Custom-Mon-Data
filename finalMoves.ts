export const Moves: { [moveid: string]: any } = {
	majestystail: {
		name: "Majesty's Tail",
		pp: 5,
		accuracy: 100,
		type: "Normal",
		basePower: 90,
		category: "Physical",
		secondary: {
			chance: 40,
			volatileStatus: "flinch",
		},
		flags: { contact: 1 },
		target: "normal",
		priority: 0,
	},
	demisefactor: {
		name: "Demise Factor",
		basePower: 75,
		accuracy: 100,
		category: "Physical",
		type: "Ghost",
		self: {
			boosts: {
				def: -1,
			},
		},
		flags: { contact: 1 },
		secondary: null,
		target: "normal",
		pp: 10,
	},
	icicles: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Icicles",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1 },
		sideCondition: "icicles",
		condition: {
			// this is a side condition
			onStart(side) {
				this.add("-sidestart", side, "Icicles");
				this.effectData.layers = 1;
			},
			onRestart(side) {
				if (this.effectData.layers >= 2) return false;
				this.add("-sidestart", side, "Icicles");
				this.effectData.layers++;
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem("heavydutyboots")) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(
					(damageAmounts[this.effectData.layers] * pokemon.maxhp) / 24
				);
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Ice",
		contestType: "Clever",
	}, //FIXME grounded fire moves thing
	auraburst: {
		name: "Aura Burst",
		pp: 15,
		basePower: 100,
		accuracy: 100,
		basePowerCallback(pokemon, target, move) {
			if (move.pp < 15) {
				return 70;
			}

			return move.basePower;
		},
		type: "Psychic",
		category: "Special",
	},
	aurashield: {
		num: 182,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Aura Shield",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: "aurashield",
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent("StallMove", pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile("stall");
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add("-singleturn", target, "Aura Shield");
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags["aurashield"]) {
					if (["gmaxoneblow", "gmaxrapidflow"].includes(move.id)) return;
					if (move.isZ || move.isMax)
						target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add("-activate", target, "move: Aura Shield");
				}
				const lockedmove = source.getVolatile("lockedmove");
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles["lockedmove"].duration === 2) {
						delete source.volatiles["lockedmove"];
					}
				}
				if (move.flags["contact"]) {
					//source.trySetStatus('psn', target);
				}
				return this.NOT_FAIL;
			}, //TODO figure out how to find the damage that it would've inflicted
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && move.flags["contact"]) {
					//source.trySetStatus('psn', target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: "clearnegativeboost" },
		contestType: "Cute",
	},
	freezeclaws: {
		basePower: 95,
		name: "Freeze Claws",
		accuracy: 95,
		category: "Physical",
		flags: { contact: 1, protect: 1, mirror: 1 },
		type: "Ice",
		onEffectiveness(typeMod, target, type) {
			if (type === "Water") return 1;
		},
		secondary: {
			chance: 10,
			status: "frz",
		},
		pp: 20,
		target: "normal",
	},
	hornburn: {
		basePower: 100,
		name: "Horn Burn",
		accuracy: 100,
		category: "Physical",
		type: "Fire",
		flags: { contact: 1, protect: 1, mirror: 1 },
	},
	billsoak: {
		type: "Water",
		name: "Bill Soak",
		category: "Status",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1 },
		onTry(source) {
			if (source.hp === source.maxhp) {
				this.add("-fail", source, "heal");
				return null;
			}
		},
		onHit(target, source, move) {
			this.heal(target.maxhp / 3); // Aesthetic only as the healing happens after you fall asleep in-game
			if (this.cureStatus()) return true;
			this.add("-activate", source, "move: Bill Soak");
		}, //TODO check why this is aesthetic-only
		secondary: null,
		target: "self",
		zMove: { effect: "clearnegativeboost" },
		contestType: "Cute",
		basePower: 0,
		accuracy: true,
	},
	goldenbite: {
		name: "Golden Bite",
		basePower: 70,
		accuracy: 100,
		category: "Physical",
		type: "Rock",
		pp: 10,
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
	},
	frostedrains: {
		name: "Frosted Rains",
		basePower: 90,
		accuracy: 100,
		category: "Special",
		type: "Ice",
		flags: {
			contact: 1,
			protect: 1,
			mirror: 1,
			gravity: 1,
			distance: 1,
			nonsky: 1,
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness("Water", type);
		},
		pp: 10,
		target: "normal",
	},
	sinisterblow: {
		name: "Sinister Blow",
		basePower: 100,
		accuracy: 95,
		category: "Physical",
		type: "Dark",
		pp: 5,
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (item.id) {
				return this.chainModify(1.2);
			}
		},
		priority: -4,
	},
	sinisterfrost: {
		name: "Sinister Frost",
		basePower: 100,
		accuracy: 95,
		category: "Special",
		type: "Dark",
		pp: 5,
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (item.id) {
				return this.chainModify(1.2);
			}
		},
		secondary: {
			chance: 20,
			volatileStatus: "flinch",
		},
	},
	sinisterwish: {
		name: "Sinister Wish",
		basePower: 0,
		accuracy: 95,
		category: "Status",
		type: "Dark",
		selfdestruct: "always",
		ohko: true,
		condition: {
			duration: 2,
			onStart(pokemon, source) {
				this.effectState.hp = source.maxhp;
				this.effectState.pp = 8;
			},
			onResidualOrder: 4,
			onEnd(target) {
				if (target && !target.fainted) {
					const damage = this.heal(this.effectState.hp, target, target);
					if (damage) {
						this.add(
							"-heal",
							target,
							target.getHealth,
							"[from] move: Sinister Wish",
							"[wisher] " + this.effectState.source.name
						);
					}
				}
			},
		},
	},
	flammabletoxins: {
		name: "Flammable Toxins",
		basePower: 100,
		accuracy: 100,
		type: "Poison",
		category: "Special",
		pp: 10,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 30,
			status: "brn",
		},
	},
	stylistsmash: {
		name: "Stylist Smash",
		type: "Rock",
		basePower: 110,
		accuracy: 95,
		category: "Physical",
		recoil: [1, 5],
	},
	stealthrock: {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1 },
		sideCondition: "stealthrock",
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add("-sidestart", side, "move: Stealth Rock");
			},
			onSwitchIn(pokemon) {
				if (
					pokemon.hasItem("heavydutyboots") ||
					(pokemon.hasAbility("mountaineer") &&
						pokemon.effectState.switchingIn) ||
					pokemon.hasAbility("anesthetized")
				)
					return;
				const typeMod = this.clampIntRange(
					pokemon.runEffectiveness(this.dex.getActiveMove("stealthrock")),
					-6,
					6
				);
				this.damage((pokemon.maxhp * Math.pow(2, typeMod)) / 8);
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Rock",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
	},
	neckcover: {
		name: "Neck Cover",
		type: "Ground",
		pp: 10,
		category: "Status",
		//TODO
	},
};
