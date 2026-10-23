function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )
	atk = akt * 2
	LuaCombatPlayerAttack( atk )
	
	pierce = LuaCombatGetCharacterStat( order, STAT_PIERCE )
	LuaCombatMonsterAddStat( STAT_PIERCE, pierce )
end