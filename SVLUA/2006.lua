function execute()
	local order = LuaGetCombatCurrentCharacterOrder()
	local atk = LuaCombatGetCharacterStat( order, STAT_ATK )	
	LuaCombatPlayerAttack( atk )
	LuaCombatMonsterAddStatPercent( STAT_DEF, -10)
end