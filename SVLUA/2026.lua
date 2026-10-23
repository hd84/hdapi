function execute()
	local order = LuaGetCombatFriendCharacterOrder()
	LuaCombatCharacterAddStatPercent( order, STAT_ATK, 9)
end