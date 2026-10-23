function execute()
	LuaCombatPlayerRemoveBuff(1)

	local order = LuaGetCombatCurrentCharacterOrder()
	local heal = LuaCombatGetCharacterStat( order, STAT_HEAL )	
	LuaCombatPlayerHeal( heal * 2 )
end