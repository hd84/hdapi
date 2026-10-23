function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	LuaCombatCharacterAddStat( order, STAT_ATK, 10 )
end