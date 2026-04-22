import { create } from 'zustand';

// ─── Lang Store ───────────────────────────────────────────────────────────────

export type Lang = 'ko' | 'en';

interface LangStore { lang: Lang; toggle: () => void; }

export const useLangStore = create<LangStore>((set) => ({
  lang: (localStorage.getItem('chronicles_lang') as Lang) ?? 'ko',
  toggle: () => set(s => {
    const next: Lang = s.lang === 'ko' ? 'en' : 'ko';
    localStorage.setItem('chronicles_lang', next);
    return { lang: next };
  }),
}));

// ─── UI Translations ──────────────────────────────────────────────────────────

const UI: Record<Lang, Record<string, string>> = {
  ko: {
    'title.tagline': '어둠 속에 잠든 기억을 되찾아라',
    'title.start': '새로운 여정',
    'title.continue': '이어하기',
    'classSelect.heading': '직업 선택',
    'classSelect.hint': '카드 조합으로 자신만의 전투 스타일을 만들어라',
    'classSelect.chapter1Label': 'Chapter 1 — 잊혀진 유적',
    'classSelect.chapter2Label': 'Chapter 2 — 저주받은 숲',
    'classSelect.hidden': '히든 직업',
    'classSelect.unlockedCount': '{{n}} 해금',
    'classSelect.unlockedBadge': '✨ 해금됨',
    'classSelect.back': '← 돌아가기',
    'classSelect.nameHint': '캐릭터 이름 (기본: {{name}})',
    'classSelect.startBtn': '{{name}}으로 시작',
    'map.deck': '🃏 덱 ({{n}})',
    'map.deckTitle': '덱 ({{n}}장)',
    'map.nextRoom': '다음 방: {{type}} — 클릭하여 입장',
    'map.advanceFloor': '{{n}}층으로 이동 →',
    'map.advanceChapter2': '챕터 2로 진행 →',
    'map.adventureComplete': '모험 완료! →',
    'map.inventory': '🎒 인벤토리',
    'map.useItem': '사용',
    'map.storyDismiss': '— 클릭하여 계속 —',
    'map.room.combat': '전투',
    'map.room.elite': '엘리트',
    'map.room.event': '이벤트',
    'map.room.shop': '상점',
    'map.room.rest': '휴식',
    'map.room.boss': '보스',
    'map.chapter.sub.1': '잊혀진 유적의 그림자',
    'map.chapter.sub.2': '저주받은 숲의 심장',
    'map.floor': '{{n}}층',
    'battle.turn': '턴 {{n}}',
    'battle.playerTurn': '🟢 플레이어 턴',
    'battle.enemyTurn': '🔴 적 턴',
    'battle.battleOver': '⭐ 전투 종료',
    'battle.endTurn': '턴 종료 →',
    'battle.comboReady': '콤보 조건 달성!',
    'battle.victory': '승리!',
    'battle.defeat': '패배',
    'battle.victoryReward': '경험치 +{{exp}} / 골드 +{{gold}}',
    'battle.continue': '계속하기',
    'battle.record': '기록 남기기',
    'battle.elite': '[엘리트]',
    'battle.boss': '[보스]',
    'battle.noPotions': '포션 없음',
    'battle.defeated': '잊혀진 유적에 쓰러지다...',
    'shop.title': '🏪 방랑 상회',
    'shop.gold': '💰 {{n}} 골드',
    'shop.cards': '스킬 카드',
    'shop.consumables': '소모품',
    'shop.buy': '{{price}} 골드',
    'shop.leave': '떠나기',
    'rest.title': '휴식의 모닥불',
    'rest.desc': '유적 한켠에서 타오르는 불씨를 발견했다. 잠시 쉬어가며 체력을 회복할 수 있다.',
    'rest.currentHp': '현재 체력',
    'rest.recovery': '회복량',
    'rest.doRest': '🔥 쉬어간다 (+{{n}} HP)',
    'rest.noRest': '🔥 불 옆에 앉아 생각을 정리한다',
    'event.continue': '계속하기 →',
    'gameover.title': '패배',
    'gameover.subtitle': '잊혀진 유적의 어둠에 삼켜지다...',
    'gameover.back': '처음으로',
    'victory.title': '승리!',
    'victory.back': '처음으로',
    'victory.ch1': '그림자 리치를 물리치고 유적의 비밀을 밝혔다.',
    'victory.ch2': '숲의 파수꾼을 쓰러뜨리고 저주받은 숲에 평화를 되찾았다.',
    'chapterClear.title': 'Chapter {{n}} 클리어!',
    'chapterClear.next': '새 챕터 시작 →',
    'stats.kills': '처치',
    'stats.combos': '콤보',
    'stats.turns': '총 턴',
    'stats.floors': '도달 층',
    'stats.gold': '보유 골드',
    'stats.deck': '덱 카드',
    'rarity.common': '일반', 'rarity.rare': '고급', 'rarity.epic': '희귀', 'rarity.legendary': '전설',
    'type.attack': '공격', 'type.defense': '방어', 'type.buff': '버프', 'type.special': '특수',
    'log.battleStart': '⚔️ {{name}}과(와) 전투 시작!',
    'log.cardPlay': '🃏 {{name}} 사용',
    'log.damageReceived': '💥 {{dmg}} 데미지 받음 (방어막 {{shield}} 흡수)',
    'log.damageDealt': '⚔️ {{dmg}} 데미지 (방어막 {{shield}})',
    'log.healed': '💚 체력 {{n}} 회복',
    'log.shielded': '🛡 방어막 {{n}}',
    'log.buffApplied': '⬆️ {{stat}} +{{n}} ({{dur}}턴)',
    'log.debuffApplied': '⬇️ 적 {{stat}} {{n}} ({{dur}}턴)',
    'log.poisonDamage': '☠️ 독으로 {{n}} 데미지!',
    'log.enemyDefeated': '✨ {{name}} 처치!',
    'log.comboActivated': '✨ 콤보 발동: {{name}}!',
    'log.turnSeparator': '── 턴 {{n}} ──',
    'log.enemyAction': '👹 {{name}}: {{action}}',
    'class.warrior': '철기사', 'class.mage': '비전학자', 'class.rogue': '그림자춤꾼', 'class.priest': '여명수호자',
    'class.druid': '자연술사', 'class.marshal': '기사단장', 'class.blood_knight': '피의 기사',
    'class.void_mage': '공허술사', 'class.phantom': '환영검사', 'class.inquisitor': '심문관',
    'class.storm_caller': '폭풍 소환사', 'class.holy_avenger': '성전사',
    'class.rune_knight': '룬 기사', 'class.shadow_inquisitor': '그림자 심문관',
  },
  en: {
    'title.tagline': 'Reclaim the memories lost in the dark',
    'title.start': 'New Journey',
    'title.continue': 'Continue',
    'classSelect.heading': 'Choose Class',
    'classSelect.hint': 'Build your own combat style through card combinations',
    'classSelect.chapter1Label': 'Chapter 1 — Forgotten Ruins',
    'classSelect.chapter2Label': 'Chapter 2 — Cursed Forest',
    'classSelect.hidden': 'Hidden Classes',
    'classSelect.unlockedCount': '{{n}} Unlocked',
    'classSelect.unlockedBadge': '✨ Unlocked',
    'classSelect.back': '← Back',
    'classSelect.nameHint': 'Character name (default: {{name}})',
    'classSelect.startBtn': 'Start as {{name}}',
    'map.deck': '🃏 Deck ({{n}})',
    'map.deckTitle': 'Deck ({{n}} cards)',
    'map.nextRoom': 'Next: {{type}} — Click to enter',
    'map.advanceFloor': 'Move to Floor {{n}} →',
    'map.advanceChapter2': 'Proceed to Chapter 2 →',
    'map.adventureComplete': 'Adventure Complete! →',
    'map.inventory': '🎒 Inventory',
    'map.useItem': 'Use',
    'map.storyDismiss': '— Click to continue —',
    'map.room.combat': 'Combat',
    'map.room.elite': 'Elite',
    'map.room.event': 'Event',
    'map.room.shop': 'Shop',
    'map.room.rest': 'Rest',
    'map.room.boss': 'Boss',
    'map.chapter.sub.1': 'Shadows of the Forgotten Ruins',
    'map.chapter.sub.2': 'Heart of the Cursed Forest',
    'map.floor': 'Floor {{n}}',
    'battle.turn': 'Turn {{n}}',
    'battle.playerTurn': '🟢 Player Turn',
    'battle.enemyTurn': '🔴 Enemy Turn',
    'battle.battleOver': '⭐ Battle Over',
    'battle.endTurn': 'End Turn →',
    'battle.comboReady': 'Combo Condition Met!',
    'battle.victory': 'Victory!',
    'battle.defeat': 'Defeat',
    'battle.victoryReward': 'EXP +{{exp}} / Gold +{{gold}}',
    'battle.continue': 'Continue',
    'battle.record': 'Save Record',
    'battle.elite': '[Elite]',
    'battle.boss': '[Boss]',
    'battle.noPotions': 'No Potions',
    'battle.defeated': 'Fallen in the forgotten ruins...',
    'shop.title': '🏪 Wandering Shop',
    'shop.gold': '💰 {{n}} Gold',
    'shop.cards': 'Skill Cards',
    'shop.consumables': 'Consumables',
    'shop.buy': '{{price}} Gold',
    'shop.leave': 'Leave',
    'rest.title': 'Campfire Rest',
    'rest.desc': 'You found a burning ember in the ruins. Rest briefly to recover HP.',
    'rest.currentHp': 'Current HP',
    'rest.recovery': 'Recovery',
    'rest.doRest': '🔥 Rest here (+{{n}} HP)',
    'rest.noRest': '🔥 Sit by the fire and gather your thoughts',
    'event.continue': 'Continue →',
    'gameover.title': 'Defeat',
    'gameover.subtitle': 'Swallowed by the darkness of the forgotten ruins...',
    'gameover.back': 'Main Menu',
    'victory.title': 'Victory!',
    'victory.back': 'Main Menu',
    'victory.ch1': 'Defeated the Shadow Lich and unveiled the secrets of the ruins.',
    'victory.ch2': 'Slew the Forest Warden and brought peace to the cursed forest.',
    'chapterClear.title': 'Chapter {{n}} Clear!',
    'chapterClear.next': 'Start Next Chapter →',
    'stats.kills': 'Kills',
    'stats.combos': 'Combos',
    'stats.turns': 'Total Turns',
    'stats.floors': 'Floors Reached',
    'stats.gold': 'Gold Held',
    'stats.deck': 'Deck Size',
    'rarity.common': 'Common', 'rarity.rare': 'Rare', 'rarity.epic': 'Epic', 'rarity.legendary': 'Legendary',
    'type.attack': 'Attack', 'type.defense': 'Defense', 'type.buff': 'Buff', 'type.special': 'Special',
    'log.battleStart': '⚔️ Battle starts with {{name}}!',
    'log.cardPlay': '🃏 {{name}} played',
    'log.damageReceived': '💥 Took {{dmg}} dmg ({{shield}} blocked)',
    'log.damageDealt': '⚔️ {{dmg}} dmg ({{shield}} blocked)',
    'log.healed': '💚 Healed {{n}} HP',
    'log.shielded': '🛡 Shield +{{n}}',
    'log.buffApplied': '⬆️ {{stat}} +{{n}} ({{dur}} turns)',
    'log.debuffApplied': '⬇️ Enemy {{stat}} {{n}} ({{dur}} turns)',
    'log.poisonDamage': '☠️ Poison deals {{n}} damage!',
    'log.enemyDefeated': '✨ {{name}} defeated!',
    'log.comboActivated': '✨ Combo: {{name}}!',
    'log.turnSeparator': '── Turn {{n}} ──',
    'log.enemyAction': '👹 {{name}}: {{action}}',
    'class.warrior': 'Iron Knight', 'class.mage': 'Arcane Scholar', 'class.rogue': 'Shadow Dancer', 'class.priest': 'Dawn Keeper',
    'class.druid': 'Nature Shaman', 'class.marshal': 'Holy Marshal', 'class.blood_knight': 'Blood Knight',
    'class.void_mage': 'Void Mage', 'class.phantom': 'Phantom Blade', 'class.inquisitor': 'Inquisitor',
    'class.storm_caller': 'Storm Caller', 'class.holy_avenger': 'Holy Avenger',
    'class.rune_knight': 'Rune Knight', 'class.shadow_inquisitor': 'Shadow Inquisitor',
  },
};

// ─── useT Hook ────────────────────────────────────────────────────────────────

export function useT() {
  const lang = useLangStore(s => s.lang);
  return (key: string, vars?: Record<string, string | number>): string => {
    let text = UI[lang][key] ?? UI.ko[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
    return text;
  };
}

// ─── Content Translations (English) ──────────────────────────────────────────

interface CardTr { name: string; description: string; }
interface MonsterTr { name: string; description: string; actionNames: Record<string, string>; }
interface ItemTr { name: string; description: string; }
interface ComboTr { name: string; flavor: string; }
interface ClassTr { name: string; description: string; }
interface EventChoiceTr { text: string; outcomes: string[]; }
interface EventTr { title: string; description: string; choices: Record<string, EventChoiceTr>; }

const CARDS_EN: Record<string, CardTr> = {
  war_c1_slash: { name: 'Strike', description: 'Swing your weapon forcefully to deal physical damage.' },
  war_c1_shield_bash: { name: 'Shield Bash', description: 'Bash the enemy with your shield, dealing damage and gaining a shield.' },
  war_c1_battle_cry: { name: 'Battle Cry', description: 'A battle cry that raises STR for 2 turns.' },
  war_c1_cleave: { name: 'Cleave', description: 'Swing wide to deal physical damage to all enemies.' },
  war_c1_iron_skin: { name: 'Iron Skin', description: 'Your skin hardens like iron, forming a powerful shield.' },
  war_c1_rend: { name: 'Rend', description: 'Tear through armor, dealing damage and reducing defense for 3 turns.' },
  war_c1_last_stand: { name: 'Last Stand', description: 'When HP is below 30%, dramatically recover and gain a shield.' },
  war_c1_execute: { name: 'Execute', description: 'A finishing blow that grows stronger the weaker the enemy.' },
  mag_c1_fireball: { name: 'Fireball', description: 'Launch a condensed flame to deal magic damage.' },
  mag_c1_frost_bolt: { name: 'Frost Bolt', description: 'Attack with a frost bolt and slow the enemy for 2 turns.' },
  mag_c1_arcane_surge: { name: 'Arcane Surge', description: 'Boost INT for 2 turns and draw 1 card.' },
  mag_c1_shock: { name: 'Shock', description: 'Electrocute the enemy with lightning, dealing magic damage.' },
  mag_c1_mana_shield: { name: 'Mana Shield', description: 'Consume MP to form a powerful magic barrier. MP 30 → Shield 45.' },
  mag_c1_blizzard: { name: 'Blizzard', description: 'A violent blizzard deals magic damage to all enemies and slows them.' },
  mag_c1_chain_lightning: { name: 'Chain Lightning', description: 'Lightning bounces between enemies, dealing powerful magic damage.' },
  mag_c1_meteor: { name: 'Meteor', description: 'Summon a massive meteor to deal devastating fire damage to all enemies.' },
  rog_c1_quick_strike: { name: 'Quick Strike', description: 'Strike fast for damage and draw 1 card.' },
  rog_c1_evade: { name: 'Evade', description: 'Dodge away and boost DEX for 2 turns.' },
  rog_c1_poison_blade: { name: 'Poison Blade', description: 'Stab with a poisoned dagger, dealing damage and applying poison for 3 turns.' },
  rog_c1_shadow_step: { name: 'Shadow Step', description: 'Melt into the shadows to boost DEX and draw 1 card.' },
  rog_c1_backstab: { name: 'Backstab', description: 'Leap from the shadows to strike a vulnerable point. More powerful when buffed.' },
  rog_c1_smoke_bomb: { name: 'Smoke Bomb', description: 'Throw a smoke bomb to reduce all enemies\' DEX for 3 turns.' },
  rog_c1_fan_of_knives: { name: 'Fan of Knives', description: 'Hurl dozens of daggers in all directions.' },
  rog_c1_death_mark: { name: 'Death Mark', description: 'Brand the enemy with a death mark. The next 2 attacks deal double damage.' },
  pri_c1_holy_light: { name: 'Holy Light', description: 'Heal yourself with sacred light.' },
  pri_c1_smite: { name: 'Smite', description: 'Strike the enemy with divine power, dealing magic damage.' },
  pri_c1_barrier: { name: 'Holy Barrier', description: 'Shield yourself with a barrier of sacred light.' },
  pri_c1_bless: { name: 'Bless', description: 'Divine blessing slightly boosts all main stats for 3 turns.' },
  pri_c1_radiant_aura: { name: 'Radiant Aura', description: 'A radiant aura restores HP each turn for 3 turns.' },
  pri_c1_judgment: { name: 'Final Judgment', description: 'Deliver a powerful holy judgment in the name of the gods.' },
  pri_c1_mass_heal: { name: 'Mass Heal', description: 'Powerful healing restores a large amount of HP and removes all debuffs.' },
  pri_c1_divine_intervention: { name: 'Divine Intervention', description: 'The gods intervene directly, restoring massive HP and granting a powerful shield.' },
  dru_c2_thorn_strike: { name: 'Thorn Strike', description: 'Strike with a thorned whip, dealing physical damage and applying 2-turn poison.' },
  dru_c2_regrowth: { name: 'Regrowth', description: 'Draw on nature\'s life force to restore HP and gain a shield.' },
  dru_c2_entangle: { name: 'Entangle', description: 'Bind the enemy with roots and vines, reducing DEX and STR for 2 turns.' },
  dru_c2_nature_wrath: { name: 'Nature\'s Wrath', description: 'Channel nature\'s fury to deal powerful magic damage.' },
  dru_c2_wild_shape: { name: 'Wild Shape', description: 'Transform into a beast form, greatly boosting STR and CON for 3 turns.' },
  dru_c2_spore_cloud: { name: 'Spore Cloud', description: 'Release toxic spores to apply heavy poison to the enemy and gain a shield.' },
  dru_c2_living_roots: { name: 'Living Roots', description: 'Living roots pierce through the enemy, dealing damage and healing yourself.' },
  dru_c2_world_tree: { name: 'World Tree', description: 'Unleash the World Tree\'s power to heal, gain a shield, and deal nature damage.' },
  msl_c2_heavy_blow: { name: 'Heavy Blow', description: 'Bring down a heavy sword with full force, dealing powerful physical damage.' },
  msl_c2_shield_wall: { name: 'Shield Wall', description: 'Raise a steel shield to create a powerful barrier.' },
  msl_c2_command: { name: 'Command', description: 'Issue battle orders to boost STR for 2 turns.' },
  msl_c2_rallying_cry: { name: 'Rallying Cry', description: 'Rally the troops with a cry, immediately recovering 1 mana.' },
  msl_c2_formation: { name: 'Formation', description: 'Take a defensive formation, gaining a shield and boosting CON for 3 turns.' },
  msl_c2_crusade: { name: 'Crusade Charge', description: 'Charge under the holy banner, dealing both physical and holy damage.' },
  msl_c2_iron_will: { name: 'Iron Will', description: 'With indomitable will, generate a powerful shield and restore HP.' },
  msl_c2_holy_siege: { name: 'Holy Siege', description: 'Unleash a holy siege, dealing intense holy damage and raising a barrier.' },
};

const MONSTERS_EN: Record<string, MonsterTr> = {
  goblin_scout: {
    name: 'Goblin Scout',
    description: 'A small goblin patrolling the forgotten ruins. Uses quick footwork and a poison dagger.',
    actionNames: { goblin_quick_slash: 'Quick Slash', goblin_poison_dart: 'Poison Dart' },
  },
  skeleton_warrior: {
    name: 'Skeleton Warrior',
    description: 'An ancient warrior\'s skeleton awakened deep in the ruins. Thick rusty armor provides solid defense.',
    actionNames: { skeleton_bone_slash: 'Bone Slash', skeleton_shield_block: 'Shield Block', skeleton_rattle_charge: 'Bone Charge' },
  },
  cursed_bat: {
    name: 'Cursed Bat',
    description: 'A giant bat corrupted by dark magic. Disrupts with ultrasonic waves and drains life.',
    actionNames: { bat_bite: 'Bite', bat_dark_screech: 'Dark Screech', bat_drain_life: 'Drain Life' },
  },
  stone_golem: {
    name: 'Stone Golem',
    description: 'A massive stone guardian created by magic to protect the ruins. Overwhelming defense and earthquake attacks.',
    actionNames: { golem_stone_fist: 'Stone Fist', golem_earth_slam: 'Earth Slam', golem_fortify: 'Fortify' },
  },
  shadow_lich: {
    name: 'Shadow Lich',
    description: 'The phantom of a mage who made a pact with death. Manipulates dark forces at the ruins\' depths.',
    actionNames: { lich_soul_drain: 'Soul Drain', lich_dark_nova: 'Dark Nova', lich_curse_wave: 'Curse Wave', lich_bone_shield: 'Bone Shield' },
  },
  forest_spider: {
    name: 'Forest Spider',
    description: 'A giant venomous spider dwelling deep in the cursed forest. Slowly drains life with venomous bites.',
    actionNames: { spider_venom_bite: 'Venom Bite', spider_web_trap: 'Web Trap', spider_quick_slash: 'Leg Slash' },
  },
  corrupted_treant: {
    name: 'Corrupted Treant',
    description: 'An ancient treant corrupted by dark energy. Slams with massive branches and scatters toxic spores.',
    actionNames: { treant_branch_slam: 'Branch Slam', treant_poison_spore: 'Poison Spore', treant_bark_shield: 'Bark Shield' },
  },
  feral_werewolf: {
    name: 'Feral Werewolf',
    description: 'A werewolf that has lost reason to the forest\'s curse. Grows stronger as the battle drags on.',
    actionNames: { wolf_feral_claw: 'Feral Claw', wolf_howl: 'Savage Howl', wolf_berserk_rage: 'Berserk Rage' },
  },
  ancient_dryad: {
    name: 'Ancient Dryad',
    description: 'Once a guardian of the cursed forest, now a corrupted ancient forest spirit. Repels intruders with nature magic.',
    actionNames: { dryad_thorn_barrage: 'Thorn Barrage', dryad_nature_pulse: 'Nature Pulse', dryad_regenerate: 'Regenerate', dryad_vine_entangle: 'Vine Entangle' },
  },
  forest_warden: {
    name: 'Forest Warden',
    description: 'The great primal guardian of the cursed forest\'s depths. Fully consumed by an ancient curse.',
    actionNames: { warden_primal_roar: 'Primal Roar', warden_ancient_strike: 'Ancient Strike', warden_natures_wrath: 'Forest\'s Wrath', warden_bark_armor: 'Primal Armor' },
  },
};

const ITEMS_EN: Record<string, ItemTr> = {
  small_potion: { name: 'Small Healing Potion', description: 'Restores 30 HP.' },
  mana_vial: { name: 'Mana Vial', description: 'Restores 25 MP.' },
  antidote: { name: 'Antidote', description: 'Immediately removes all poison debuffs.' },
  common_card_shard: { name: 'Common Card Shard', description: 'A magical crystal shard used to craft common skill cards.' },
  rare_card_shard: { name: 'Rare Card Shard', description: 'A refined magical crystal used to craft rare skill cards.' },
  epic_card_shard: { name: 'Epic Card Shard', description: 'A rare magical gemstone used to craft epic skill cards.' },
  iron_fragment: { name: 'Iron Fragment', description: 'A corroded iron fragment from a skeleton warrior\'s armor.' },
  bat_fang: { name: 'Bat Fang', description: 'A sharp fang from a cursed bat, laced with poison.' },
  dark_essence: { name: 'Dark Essence', description: 'Concentrated dark energy extracted from creatures of darkness.' },
  stone_fragment: { name: 'Stone Fragment', description: 'A magically infused stone chip from the golem\'s body.' },
  golem_core: { name: 'Golem Core', description: 'The magical core that animated the stone golem. Strong energy remains.' },
  ancient_tome: { name: 'Ancient Tome', description: 'A forgotten spellbook the lich treasured. Hard to decipher.' },
  lich_relic: { name: 'Lich\'s Relic', description: 'Remnant of the Shadow Lich. Grants INT +3 and 5 mana at battle start.' },
  rusty_pendant: { name: 'Rusty Pendant', description: 'An old pendant found in the ruins. Grants max HP +15.' },
  shadow_crystal: { name: 'Shadow Crystal', description: 'A crystal imbued with dark energy. Grants evasion +5%.' },
  large_potion: { name: 'Large Healing Potion', description: 'Restores 60 HP.' },
  forest_elixir: { name: 'Forest Elixir', description: 'Restores 35 HP and removes poison debuffs.' },
  mana_crystal_vial: { name: 'Mana Crystal Vial', description: 'Restores 40 MP.' },
  spider_venom_gland: { name: 'Spider Venom Gland', description: 'A concentrated venom sac harvested from a forest spider.' },
  forest_herb: { name: 'Forest Herb', description: 'A rare herb that survived even in the cursed forest.' },
  ancient_bark: { name: 'Ancient Bark', description: 'The bark of a centuries-old treant. Hard and imbued with magic.' },
  wolf_pelt: { name: 'Wolf Pelt', description: 'The thick pelt of a feral werewolf. Used in armor crafting.' },
  beast_fang: { name: 'Beast Fang', description: 'The steel-like fang of a werewolf. Sharp and tough.' },
  dryad_tear: { name: 'Dryad\'s Tear', description: 'Crystallized pure nature energy shed by the Ancient Dryad.' },
  warden_heart: { name: 'Warden\'s Heart', description: 'The Forest Warden\'s heart, condensed with primal power.' },
  nature_relic: { name: 'Nature Relic', description: 'The Dryad\'s relic. Grants INT +3 and poison resistance +20%.' },
  warden_amulet: { name: 'Warden\'s Amulet', description: 'An amulet of primal power. Grants max HP +20, STR +2.' },
  bark_shield_relic: { name: 'Bark Shield Relic', description: 'A shield relic from ancient treant heartwood. Grants CON +3 and shield +10%.' },
};

const COMBOS_EN: Record<string, ComboTr> = {
  combo_c1_steam_burst: { name: 'Steam Burst', flavor: 'Fire and ice collide, creating an explosive burst of steam.' },
  combo_c1_toxic_strike: { name: 'Toxic Strike', flavor: 'Coat your weapon in lethal poison and drive it deep.' },
  combo_c1_shadow_execute: { name: 'Shadow Execute', flavor: 'A blade flashing from darkness severs the enemy\'s breath.' },
  combo_c1_holy_bulwark: { name: 'Holy Bulwark', flavor: 'Sacred light reinforces your barrier and seals your wounds.' },
  combo_c1_thunder_cleave: { name: 'Thunder Cleave', flavor: 'Sweep the battlefield with a lightning-wrapped weapon, striking all foes.' },
  combo_c1_arcane_blade: { name: 'Arcane Blade', flavor: 'Channel magic into your weapon to deliver physical and magical damage at once.' },
  combo_c1_marked_execution: { name: 'Marked Execution', flavor: 'An unavoidable execution upon a foe branded with the death mark.' },
  combo_c1_blessing_of_war: { name: 'Blessing of War', flavor: 'A god-blessed war cry elevates all of your abilities.' },
  combo_c2_poison_burst: { name: 'Poison Burst', flavor: 'Nature\'s toxins explode all at once, releasing lethal energy.' },
  combo_c2_iron_sanctuary: { name: 'Iron Sanctuary', flavor: 'Holy light wraps around the iron barrier, forming a powerful sanctuary.' },
  combo_c2_natures_judgment: { name: 'Nature\'s Judgment', flavor: 'Nature and divinity combine into a beam of righteous judgment.' },
  combo_c2_beast_wrath: { name: 'Beast Wrath', flavor: 'Beast instinct and a knight\'s strength combine into a storm-like strike.' },
  combo_c2_rooted_fortress: { name: 'Rooted Fortress', flavor: 'Roots anchor your feet while your shield holds the enemy at bay.' },
};

const CLASSES_EN: Record<string, ClassTr> = {
  warrior: { name: 'Iron Knight', description: 'A warrior who guards the front line with steel armor and indomitable will. Protects through brute strength and defense.' },
  mage: { name: 'Arcane Scholar', description: 'A mage who deciphers ancient texts and wields the elements freely. Overcomes low HP with massive magical power.' },
  rogue: { name: 'Shadow Dancer', description: 'An assassin who moves like a dance in darkness, striking lethally. Slowly breaks enemies with poison and deception.' },
  priest: { name: 'Dawn Keeper', description: 'A cleric who heals allies and purifies darkness with the power of light. Punishes evil with divine judgment.' },
  druid: { name: 'Nature Shaman', description: 'A shaman who communes with the cursed forest and wields the power of life. Weakens enemies with poison and nature magic, sustained by strong regeneration.' },
  marshal: { name: 'Holy Marshal', description: 'An elite knight who commands the front line with iron armor and sacred faith. Dominates the battlefield with powerful defense and heavy strikes.' },
  blood_knight: { name: 'Blood Knight', description: 'A warrior who channels the power of bloodshed into devastating might.' },
  void_mage: { name: 'Void Mage', description: 'A mage who has mastered the empty spaces between realities.' },
  phantom: { name: 'Phantom Blade', description: 'A duelist who strikes from the veil between shadows and light.' },
  inquisitor: { name: 'Inquisitor', description: 'A zealot who wields divine judgment as both sword and shield.' },
  storm_caller: { name: 'Storm Caller', description: 'A legendary shaman who weaves the fury of nature and lightning into one. Covers the battlefield in storms through combo chains.' },
  holy_avenger: { name: 'Holy Avenger', description: 'A warrior of sword and chalice who judges fiends in the name of the gods. Divine fury accumulates with each enemy slain.' },
  rune_knight: { name: 'Rune Knight', description: 'A knight who inscribes ancient runes to blend arcane and martial power.' },
  shadow_inquisitor: { name: 'Shadow Inquisitor', description: 'A hybrid who melds the rogue\'s subtlety with the inquisitor\'s divine wrath.' },
};

const EVENTS_EN: Record<string, EventTr> = {
  event_c1_wandering_merchant: {
    title: 'Wandering Merchant',
    description: 'An old man pulling a worn cart by a single candle in the darkness spoke to you. "Brave of you to come this far. Care to see my wares?"',
    choices: {
      buy_potion: { text: 'Buy a small healing potion. (50 Gold)', outcomes: ['"A wise choice." The old man handed over a potion and vanished.'] },
      ask_info: { text: 'Ask about the ruins.', outcomes: ['"An ancient lich sleeps at the end of these ruins. It fears the light — remember that." You received a card shard as a gift.'] },
      ignore: { text: 'Ignore and pass by.', outcomes: ['The old man muttered to himself and disappeared into the darkness.'] },
    },
  },
  event_c1_ancient_altar: {
    title: 'Ancient Altar',
    description: 'You stopped before a blood-stained altar. An ancient symbol glimmered faintly at the center. An offering might bring a reward.',
    choices: {
      offer_gold: { text: 'Offer gold. (80 Gold)', outcomes: ['The altar glowed golden and infused you with power. STR and INT permanently +1.'] },
      offer_hp: { text: 'Offer blood. (20% max HP)', outcomes: ['The altar absorbed your blood and produced a rare card shard.', 'The altar absorbed your blood but nothing happened. A waste.'] },
      leave: { text: 'Leave without touching it.', outcomes: ['The light faded slowly. Safe, but you missed the chance.'] },
    },
  },
  event_c1_trapped_adventurer: {
    title: 'Trapped Adventurer',
    description: 'An adventurer pinned under rubble groaned. "Please... help me." An old map was clutched in their hand.',
    choices: {
      rescue: { text: 'Use your strength to rescue them. (15 HP)', outcomes: ['"Thank you!" The adventurer gave you everything they had. Obtained a small potion and 60 Gold.'] },
      take_map: { text: 'Take the map and leave.', outcomes: ['You took the map. The layout of this floor was revealed. But a curse followed your departing back.'] },
      pass: { text: 'Pretend not to notice and pass by.', outcomes: ['The groaning faded behind you. Your heart was heavy, but you pressed on.'] },
    },
  },
  event_c1_mysterious_library: {
    title: 'Mysterious Library',
    description: 'Three books caught your eye among dusty shelves. Each radiated a different magical aura.',
    choices: {
      read_red_book: { text: 'Read the red book. (Attack spellbook)', outcomes: ['Visions of fire and lightning burned into your mind. Obtained 1 attack skill card.'] },
      read_blue_book: { text: 'Read the blue book. (Defense spellbook)', outcomes: ['Cold wisdom of defense seeped in. Obtained 1 defense/buff skill card.'] },
      read_black_book: { text: 'Read the black book. (Forbidden spellbook)', outcomes: ['Intense dark knowledge flooded in. Obtained 2 rare card shards, but max HP permanently -10.', 'A dark curse attacked your mind. Max HP reduced by 20.'] },
    },
  },
  event_c1_restoration_spring: {
    title: 'Restoration Spring',
    description: 'You found a faintly glowing spring deep in the ruins. The water was cold and clear, with a faintly sacred aura.',
    choices: {
      drink_fully: { text: 'Drink as much as you want.', outcomes: ['Your HP was fully restored. Your body felt light and refreshed.', 'It was cool at first, but a strange aftertaste lingered. You were poisoned.'] },
      drink_carefully: { text: 'Carefully take just one sip.', outcomes: ['You restored 40 HP. A cautious choice.'] },
      fill_vial: { text: 'Fill a vial to take with you.', outcomes: ['You obtained a vial of spring water. It can be used later.'] },
    },
  },
  event_c2_poisonous_mushroom: {
    title: 'Poisonous Mushroom Grove',
    description: 'Colorful mushrooms formed a grove between dense trees. Some looked edible; others were suspect. Legend says all survivors of the cursed forest owe it to these mushrooms.',
    choices: {
      eat_bright_mushroom: { text: 'Eat the brightly colored mushroom.', outcomes: ['A strange energy spread through your body. STR +2, INT +2 permanently.', 'You got an upset stomach. HP reduced by 20.'] },
      collect_mushroom: { text: 'Collect them as herbs.', outcomes: ['You gathered mushrooms along with forest herbs. Useful materials.'] },
      ignore_mushroom: { text: 'They look dangerous — ignore them.', outcomes: ['You passed by safely.'] },
    },
  },
  event_c2_wounded_deer: {
    title: 'Wounded Deer',
    description: 'A deer lay collapsed with a poison thorn in its foreleg. Its eyes shone brilliantly. A sacred aura hung about it.',
    choices: {
      heal_deer: { text: 'Remove the thorn and treat the wound.', outcomes: ['The deer slowly rose and bowed to you before disappearing. You felt the forest\'s blessing. Restored 50 HP.'] },
      leave_deer: { text: 'Pass by without doing anything.', outcomes: ['The deer\'s sad eyes followed your retreating back. Nothing happened.'] },
      take_thorn: { text: 'Harvest the poison thorn.', outcomes: ['You obtained a poison thorn. It could be a useful material, but the deer howled in pain.'] },
    },
  },
  event_c2_witch_hut: {
    title: 'Witch\'s Hut',
    description: 'Purple smoke rose from a hut nestled in the forest. A one-eyed witch peered out as the door opened. "Welcome, rare to have visitors. Care to trade?"',
    choices: {
      trade_card: { text: 'Ask to exchange a card. (100 Gold)', outcomes: ['"Interesting choice." The witch took an old card and handed over a rare card shard.'] },
      buy_curse_removal: { text: 'Commission debuff removal. (60 Gold)', outcomes: ['The witch stirred her cauldron and all your debuffs vanished. HP also restored by 20.'] },
      steal_brew: { text: 'Push the witch aside and drink from the cauldron.', outcomes: ['"Thief!" Along with the witch\'s curse, intense energy surged. STR +3, max HP -15.', '"Foolish." The witch laughed. A curse reduced all stats for several turns.'] },
    },
  },
  event_c2_ancient_tree_altar: {
    title: 'Ancient Tree Altar',
    description: 'A small altar stood before an ancient tree that must be thousands of years old. Traces of offerings from past travelers lay between the roots. The tree breathed slowly, as if alive.',
    choices: {
      offer_gold_tree: { text: 'Bury gold at the roots. (100 Gold)', outcomes: ['The tree radiated warmth and bestowed a blessing. Max HP +20, all stats +1 permanently.'] },
      meditate_tree: { text: 'Meditate before the altar.', outcomes: ['A quiet peace settled into your body. HP fully restored.', 'You fell asleep while concentrating. Someone stole your gold while you slept. Gold -40.'] },
      take_bark_sample: { text: 'Harvest some bark.', outcomes: ['You obtained ancient bark.', 'The tree was angered. A massive branch struck you, reducing HP by 25.'] },
    },
  },
  event_c2_cursed_spring: {
    title: 'Cursed Spring',
    description: 'You stopped before a spring shrouded in dark energy. Something glimmered faintly in the water. Legend says this spring grants wishes — but at a price.',
    choices: {
      drink_cursed_water: { text: 'Drink from the spring.', outcomes: ['Intense power surged. STR +4, INT +4, but max HP -30.', 'The black water spread through your body. Applied heavy poison for 3 turns and HP reduced by 30.'] },
      throw_coin: { text: 'Throw a coin and make a wish.', outcomes: ['Your wish was granted. Obtained 150 Gold.', 'The coin was sucked in and nothing happened.'] },
      search_bottom: { text: 'Try to retrieve the glimmering object from the bottom.', outcomes: ['You fished out a rare relic! Obtained ancient bark and a rare card shard.', 'Your hand touched the cursed water. HP -20, DEX -3 (2 turns).'] },
    },
  },
};

// ─── useContent Hook ──────────────────────────────────────────────────────────

export function useContent() {
  const lang = useLangStore(s => s.lang);
  const isEn = lang === 'en';

  const card = (id: string, field: 'name' | 'description', ko: string) =>
    isEn ? (CARDS_EN[id]?.[field] ?? ko) : ko;

  const monster = (id: string, field: 'name' | 'description', ko: string) =>
    isEn ? (MONSTERS_EN[id]?.[field] ?? ko) : ko;

  const monsterAction = (monsterId: string, actionId: string, ko: string) =>
    isEn ? (MONSTERS_EN[monsterId]?.actionNames[actionId] ?? ko) : ko;

  const item = (id: string, field: 'name' | 'description', ko: string) =>
    isEn ? (ITEMS_EN[id]?.[field] ?? ko) : ko;

  const combo = (id: string, field: 'name' | 'flavor', ko: string) =>
    isEn ? (COMBOS_EN[id]?.[field] ?? ko) : ko;

  const cls = (id: string, field: 'name' | 'description', ko: string) =>
    isEn ? (CLASSES_EN[id]?.[field] ?? ko) : ko;

  const eventTitle = (id: string, ko: string) =>
    isEn ? (EVENTS_EN[id]?.title ?? ko) : ko;

  const eventDesc = (id: string, ko: string) =>
    isEn ? (EVENTS_EN[id]?.description ?? ko) : ko;

  const choiceText = (eventId: string, choiceId: string, ko: string) =>
    isEn ? (EVENTS_EN[eventId]?.choices[choiceId]?.text ?? ko) : ko;

  const outcomeText = (eventId: string, choiceId: string, idx: number, ko: string) =>
    isEn ? (EVENTS_EN[eventId]?.choices[choiceId]?.outcomes[idx] ?? ko) : ko;

  return { card, monster, monsterAction, item, combo, cls, eventTitle, eventDesc, choiceText, outcomeText };
}

// ─── English name helpers (used in battleStore) ───────────────────────────────

export function getMonsterNameEn(id: string, ko: string): string {
  return MONSTERS_EN[id]?.name ?? ko;
}
export function getCardNameEn(id: string, ko: string): string {
  return CARDS_EN[id]?.name ?? ko;
}
export function getMonsterActionNameEn(monsterId: string, actionId: string, ko: string): string {
  return MONSTERS_EN[monsterId]?.actionNames[actionId] ?? ko;
}
