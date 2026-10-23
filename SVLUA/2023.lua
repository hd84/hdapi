function execute()
	LuaCombatMonsterAddStatPercent( STAT_ATK, -1 )
	
	local order = LuaGetCombatCurrentCharacterOrder()
	LuaCombatCharacterAddStatPercent( order, STAT_ATK, 10)
end