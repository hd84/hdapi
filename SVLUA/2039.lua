function execute()
	LuaCombatMonsterAddStatPercent( STAT_HEAL, -10)

	local order = LuaGetCombatFriendCharacterOrder()
	LuaCombatCharacterAddStatPercent( order, STAT_HEAL, 20)
end