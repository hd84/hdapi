function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk1 = LuaCombatGetCharacterStat( order, STAT_ATK)

	order = LuaGetCombatFriendCharacterOrder()
	local atk2 = LuaCombatGetCharacterStat( order, STAT_ATK)

	LuaCombatMonsterAddStat( STAT_ATK, atk1 + atk2 )
end