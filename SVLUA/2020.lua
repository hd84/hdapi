function execute()
	LuaCombatPlayerAddIgnoreDefense( 1000000 )

	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )
	atk = atk * 5
	LuaCombatPlayerAttack( atk )
end