function execute()
	local order = LuaGetCombatCurrentCharacterOrder()		
	LuaCombatCharacterAddStatPercent( order, STAT_HEAL, 10 )
end