function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	LuaCombatMonsterAddStatPercent( order, STAT_PIERCE, 100);
end