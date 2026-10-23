function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	LuaCombatCharacterAddStat( order, STAT_CRITICAL_DAMAGE, 10)
end