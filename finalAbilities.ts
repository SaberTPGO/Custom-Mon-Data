export const Abilities: { [abilityid: string]: any } = {
	anesthetized: {
		name: 'Anesthetized', // Hazard Immunity implemented in moves.ts
	},
	angelic: {
		name: 'Angelic',
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Angelic');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			if (!move.auraBooster) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([2048, 4096]);
		},
		isBreakable: true,
	},
	aquaticcharge: {
		name: 'Aquatic Charge',
		onTryHit(target, source, move) {
			if (target !== source && (move.type === 'Water' || move.type === 'Electric')) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Aquatic Charge');
				}
				return null;
			}
		},
	},
	aura: {
		name: 'Aura',
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({ atk: 1, def: 1, spa: 1, spd: 1, spe: 1 });
			}
		},
	},
	cavestream: {
		name: 'Cave Stream',
		onStart(pokemon) {
			this.field.setWeather('sandstorm');
			pokemon.addVolatile('cavestream');
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['cavestream'];
			this.add('-end', pokemon, 'Cave Stream', '[silent]');
		},
		condition: {
			duration: 5,
			onStart(target) {
				this.add('-start', target, 'ability: Cave Stream');
			},
			onModifyAtk(atk, pokemon) {
				if (pokemon.effectiveWeather() === 'sandstorm') {
					return this.chainModify(1.1);
				}
			},
			onModifyDef(def, pokemon) {
				if (pokemon.effectiveWeather() === 'sandstorm') {
					return this.chainModify(1.1);
				}
			},
			onModifySpA(spa, pokemon) {
				if (pokemon.effectiveWeather() === 'sandstorm') {
					return this.chainModify(1.1);
				}
			},
			onModifySpD(spd, pokemon) {
				if (pokemon.effectiveWeather() === 'sandstorm') {
					return this.chainModify(1.1);
				}
			},
			onModifySpe(spe, pokemon) {
				if (pokemon.effectiveWeather() === 'sandstorm') {
					return this.chainModify(1.1);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Cave Stream');
			},
		},
	},
	cleansingaura: {
		name: 'Cleansing Aura',
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Aromatherapy');
			let success = false;
			for (const ally of target.side.pokemon) {
				if (
					ally !== source &&
					(ally.hasAbility('sapsipper') || (ally.volatiles['substitute'] && !move.infiltrates))
				) {
					continue;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
	},
	coldblooded: {
		name: 'Cold Blooded',
		onWeather(target, source, effect) {
			let type;
			if (effect.id === 'sandstorm') {
				type = 'Ground';
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				type = 'Fire';
			} else if (effect.id === 'hail') {
				type = 'Ice';
			}
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Cold Blooded');
			}
		},
	},
	conceit: {
		name: 'Conceit',
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ spa: length }, source);
			}
		},
	},
	contaminate: {
		name: 'Contaminate',
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment',
				'multiattack',
				'naturalgift',
				'revelationdance',
				'technoblast',
				'terrainpulse',
				'weatherball',
			];
			if (
				move.type === 'Normal' &&
				!noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status')
			) {
				move.type = 'Poison';
				move.contaminateBoosted = true;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.contaminateBoosted) return this.chainModify([4915, 4096]);
		},
	},
	continentalblow: {
		name: 'Continental Blow',
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['contact'] || move.type === 'Ground') return this.chainModify([4915, 4096]);
		},
	},
	contrastingminds: {
		name: 'Contrasting Minds',
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Contrasting Minds');
			}
		},
		onModifyMove(move) {
			move.stab = 2;
		},
	},
	deathsgrip: {
		name: "Death's Grip",
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				this.damage(source.hp - 1, source, target);
			}
		},
	},
	demonic: {
		name: 'Demonic',
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Demonic');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			if (!move.auraBooster) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([8192, 4096]);
		},
		isBreakable: true,
	},
	draconize: {
		name: 'Draconize',
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment',
				'multiattack',
				'naturalgift',
				'revelationdance',
				'technoblast',
				'terrainpulse',
				'weatherball',
			];
			if (
				move.type === 'Normal' &&
				!noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status')
			) {
				move.type = 'Dragon';
				move.draconizeBoosted = true;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.draconizeBoosted) return this.chainModify([4915, 4096]);
		},
	},
	eternalfrost: {
		name: 'Eternal Frost',
		onDamage(damage, target, source, effect) {
			if (this.randomChance(1, 4)) {
				source.trySetStatus('frz', target);
			}
		},
	},
	extinctthreat: {
		name: 'Extinct Threat',
		onDamagingHit(target, source, move) {
			if (!target.hp) return;
			if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) {
				const statName = move.category === 'Special' ? 'spa' : 'atk';
				this.boost({ [statName]: 1 }, source);
			}
		},
	},
	fairysgrace: {
		name: "Fairy's Grace",
		onFaint(pokemon) {
			pokemon.side.addSlotCondition('pokemon', 'healingwish');
		},
	},
	float: {
		name: 'Float',
		onTryHit(target, source, move) {
			if (target !== source && (move.type === 'Ground' || move.type === 'Rock' || move.type === 'Steel')) {
				this.add('-immune', target, '[from] ability: Float');
				return null;
			}
		},
		// Hazard damage implemented in moves.ts
	},
	frightful: {
		name: 'Frightful',
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Frightful', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ def: -1 }, target, pokemon, null, true);
				}
			}
		},
	},
	frostbite: {
		name: 'Frostbite',
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Frostbite');
			this.boost({ def: 1, spd: 1 });
		},
		onSetStatus(status, target, source, effect) {
			//if ((effect as Move)?.status) {}
			if (effect?.status) {
				this.add('-immune', target, '[from] ability: Frostbite');
			}
			return false;
		},
		// Permanent frozen "status" implemented in the relevant sleep-checking effects
		isPermanent: true,
		isUnbreakable: true,
	},
	hivemind: {
		name: 'Hive Mind',
		onBasePower(basePower, pokemon, target, move) {
			for (const ally of pokemon.allies()) {
				if (ally.types.includes('Bug')) {
					return this.chainModify([5325, 4096]);
				}
			}
		},
	},
	'holo-punch': {
		name: 'Holo-Punch',
		onModifyMove(move) {
			if (!(move?.flags['contact'] || move.flags('punch')) || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 20,
				status: 'brn',
				ability: this.dex.abilities.get('holo-punch'),
			});
		},
	},
	humidhair: {
		name: 'Humid Hair',
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.boost({ spd: 1 }, target, source, null, true);
				return false;
			}
		},
	},
	icesecretion: {
		name: 'Ice Secretion',
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('frz', target);
				}
			}
		},
	},
	kingsrule: {
		name: "King's Rule",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.basePower < 65) return priority + 1;
		},
	},
	mountaineer: {
		name: 'Mountaineer', // Hazard Immunity implemented in moves.ts
		onSwitchIn(pokemon) {
			this.effectState.switchingIn = true;
		},
		onTryHit(pokemon, target, move) {
			if (move.type === 'Rock' && this.effectState.switchingIn) {
				this.add('-immune', pokemon, '[from] ability: Mountaineer');
				return null;
			}
		},
		onEnd(pokemon) {
			if (!this.effectState.switchingIn) return;
			this.add('-ability', pokemon, 'Mountaineer');
			this.effectState.switchingIn = false;
		},
	},
	mudilate: {
		name: 'Mudilate',
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment',
				'multiattack',
				'naturalgift',
				'revelationdance',
				'technoblast',
				'terrainpulse',
				'weatherball',
			];
			if (
				move.type === 'Normal' &&
				!noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status')
			) {
				move.type = 'Ground';
				move.mudilateBoosted = true;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			if (move.mudilateBoosted) return this.chainModify([4915, 4096]);
		},
	},
	naturalgift: {
		name: 'Natural Gift', //TODO
	},
	nocturnal: {
		name: 'Nocturnal',
		onStart(pokemon) {
			const today = new Date();
			const hours = today.getHours();
			if (hours >= 19) {
				this.boost({ spe: 1 });
			} else {
				this.boost({ spe: -1 });
			}
		},
		rating: 0,
	},
	pipedreams: {
		name: 'Pipe Dreams',
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			this.add('-activate', source, 'ability: Pipe Dreams');
			this.boost({ atk: 1, spa: 1 }, target, source, null, true);
		},
	},
	poisondarts: {
		name: 'Poison Darts',
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.baseMaxhp / 8);
				return this.chainModify([4915, 4096]);
			}
		},
		onModifyMove(move) {
			if (!move?.flags['contact'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'psn',
				ability: this.dex.abilities.get('poisondarts'),
			});
		},
	},
	predict: {
		name: 'Predict',
		onStart(pokemon) {
			//let warnMoves: (Move | Pokemon)[][] = [];
			let warnMoves = [];
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					warnMoves.push([move, target]);
				}
			}
			if (!warnMoves.length) return;
			const [warnMoveName1, warnTarget1] = this.sample(warnMoves);
			const [warnMoveName2, warnTarget2] = this.sample(warnMoves);
			this.add('-activate', pokemon, 'ability: Predict', warnMoveName1, '[of] ' + warnTarget1);
			this.add('-activate', pokemon, 'ability: Predict', warnMoveName2, '[of] ' + warnTarget2);
		},
	},
	regret: {
		name: 'Regret', //FIXME ask if Regret should apply for allies in doubles
		onModifyMove(move, pokemon) {
			if (this.randomChance(1, 4)) {
				move.heal = [1, 8];
			}
		},
	},
	rockarmor: {
		name: 'Rock Armor',
		onSourceModifyDamage(damage, source, target, move) {
			this.debug('Rock Armor neutralize');
			return this.chainModify(0.9);
		},
	},
	royal: {
		name: 'Royal',
		onStart(pokemon) {
			this.boost({ def: 1, spd: 1 });
		},
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				if (this.dex.moves.get(moveSlot.move).basePower >= 66) {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
	},
	sharkjumper: {
		name: 'Shark Jumper',
		onStart(pokemon) {
			if (this.randomChance(1, 4)) {
				this.boost({ atk: 1 });
			}
			if (this.randomChance(1, 4)) {
				this.boost({ spe: 1 });
			}
		},
	},
	shockabsorb: {
		name: 'Shock Absorb',
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({ spe: 1 })) {
					this.add('-immune', target, '[from] ability: Shock Absorb');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Electric' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectData.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Shock Absorb');
				}
				return this.effectData.target;
			}
		},
	},
	spikeeffect: {
		name: 'Spike Effect',
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(15, 100)) {
					source.trySetStatus('brn', target);
				} else if (this.randomChance(15, 100)) {
					source.trySetStatus('psn', target);
				} else if (this.randomChance(15, 100)) {
					source.trySetStatus('par', target);
				} else if (this.randomChance(15, 100)) {
					source.trySetStatus('slp', target);
				}
			}
		},
	},
	spiritual: {
		name: 'Spiritual',
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle')
				return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Spiritual immunity: ' + move.id);
			if (!(move.type === 'Dark' || move.type === 'Ghost' || move.type === 'Psychic')) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Spiritual');
				}
				return null;
			}
		},
	},
	stonefaced: {
		name: 'Stone Faced',
		onSetStatus(status, target, source, effect) {
			if (effect?.status) {
				this.add('-immune', target, '[from] ability: Stone Faced');
				this.heal(target.baseMaxhp / 4);
			}
			return false;
		},
	},
	stormpower: {
		name: 'Storm Power', //TODO
	},
	strikingblades: {
		name: 'Striking Blades',
		onModifyCritRatio(critRatio) {
			return 5;
		},
		onModifyMove(move) {
			move.stab = 1;
		},
	},
	supershield: {
		name: 'Super Shield',
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle')
				return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) > 0) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Wonder Guard');
				}
				return null;
			}
		},
	},
	toxicabsorb: {
		name: 'Toxic Absorb',
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Poison') {
				if (!this.boost({ spe: 1, atk: 1 })) {
					this.add('-immune', target, '[from] ability: Toxic Absorb');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Poison' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectData.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Toxic Absorb');
				}
				return this.effectData.target;
			}
		},
	},
	toxicbody: {
		name: 'Toxic Body',
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			for (const target of this.getAllActive()) {
				if (target === pokemon && pokemon.isAdjacent(target)) continue;
				if (target.status) {
					this.heal(pokemon.baseMaxhp / 16);
					break;
				}
			}
			this.heal(pokemon.baseMaxhp / 16);
		},
	},
	toxicemission: {
		name: 'Toxic Emission',
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					source.trySetStatus('tox', target);
				}
			}
		},
	},
	toxicoat: {
		name: 'Toxicoat',
		onStart(pokemon) {
			this.boost({ spd: 2 });
		},
	},
	wingdispose: {
		name: 'Wing Dispose',
		onTryHit(target, source, move) {
			if (move.category === 'Physical') {
				this.boost({ atk: -1, spe: -1, def: -1 });
			} else {
				this.boost({ atk: 1, spe: 1 });
			}
		},
	},
	wishfulthinking: {
		name: 'Wishful Thinking', //TODO
	},
	wonderarmor: {
		name: 'Wonder Armor',
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle')
				return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) > 0) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Wonder Guard');
				}
				return null;
			}
		}, //TODO figure out indirect damage
	},
};
