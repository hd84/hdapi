function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )
	atk = akt * 2
	LuaCombatPlayerAttack( atk )

	order = LuaGetCombatFriendCharacterOrder()
	LuaCombatMonsterAddStat( order, STAT_PIERCE, 10 )
end