exports.game_user = [{
    uid:{type:"number", desc : "user ID"},
    lv:{type:"number", desc : "user level"},
    exp:{type:"number", desc : "user experience"},
    nick:{type:"string", desc : "user nickname"},
    gold:{type:"number", desc : "user gold"},
    gem_paid:{type:"number", desc : "user paid gems"},
    gem_free:{type:"number", desc : "user free gems"},
    heart:{type:"number", desc : "user heart"},
    heart_at:{type:"string", desc : "heart timestamp"},
    created_at:{type:"string", desc : "creation timestamp"},
    updated_at:{type:"string", desc : "update timestamp"}
}];

exports.user_card = [{
    idx:{type:"number", desc : "card ID"},
    uid:{type:"number", desc : "user ID"},
    did:{type:"number", desc : "data ID"},
    lv:{type:"number", desc : "card level"},
    exp:{type:"number", desc : "card experience"},
    count:{type:"number", desc : "card count"},
    created_at:{type:"string", desc : "creation timestamp"},
    updated_at:{type:"string", desc : "update timestamp"}
}];

exports.user_character = [{
    idx:{type:"number", desc : "card ID"},
    uid:{type:"number", desc : "user ID"},
    did:{type:"number", desc : "data ID"},
    lv:{type:"number", desc : "card level"},
    exp:{type:"number", desc : "card experience"},    
    created_at:{type:"string", desc : "creation timestamp"},
    updated_at:{type:"string", desc : "update timestamp"}
}];