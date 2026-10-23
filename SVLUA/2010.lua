function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	LuaCombatMonsterAddStat( order, STAT_PIERCE, 10 )
end