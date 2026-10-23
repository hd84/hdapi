function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )
	LuaCombatPlayerAttack( atk )

	local def = LuaCombatGetCharacterStat( order, STAT_DEF )	
	LuaCombatCharacterAddStat( order, STAT_ATK, def)
end