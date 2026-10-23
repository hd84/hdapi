function execute()
	local order = LuaGetCombatCurrentCharacterOrder()	
	LuaCombatCharacterAddStatPercent( order, STAT_ATK, 100 )
end