function execute()
	LuaCombatPlayerAddIgnoreDefense( 100 )

	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )
	atk = atk * 2
	LuaCombatPlayerAttack( atk )
end