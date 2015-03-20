Meteor.methods({
    new_contract: function(attrs){
        return GLOBS.CONTRACTS.insert(attrs, function(err){
            if (err){
                throw new Meteor.Error('validation', err.sanitizedError);
            }
        });
    },

    update_contract: function(cid, attrs){
        return GLOBS.CONTRACTS.update(cid , { $set: attrs }, function(err){
            if (err){
                throw new Meteor.Error('validation', err.sanitizedError);
            }
        });
    },

    remove_contract: function(cid){
        return GLOBS.CONTRACTS.remove(cid);
    }
});

Meteor.publish('user_contracts', function(){
    return GLOBS.CONTRACTS.find({ user_id: this.userId });
});
