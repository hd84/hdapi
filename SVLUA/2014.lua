function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	LuaCombatCharacterAddStat( order, STAT_DEF, 20)
end