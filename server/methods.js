Meteor.methods({
    new_contract: function(attrs){
        return GLOBS.CONTRACTS.insert(attrs);
    },

    update_contract: function(cid, attrs){
        return GLOBS.CONTRACTS.update(cid , attrs);
    },

    remove_contract: function(cid){
        return GLOBS.CONTRACTS.remove(cid);
    }
});
