Router.configure({
    layoutTemplate: 'wrapper'
});

Router.onBeforeAction(function(){
    if (!Meteor.userId()) {
        this.render('login');
    } else {
        this.next();
    }
});

Router.route('/', function(){
    this.redirect('contract');
});

Router.route('/contract', function(){
    this.render('form', {
        data: {
            contract: {}
        }
    });
});

Router.route('/contract/:cid', {
    template: 'form',

    waitOn: function(){
        return Meteor.subscribe('user_contracts');
    },

    data: function(){
        return {
            contract: GLOBS.CONTRACTS.findOne(this.params.cid)
        };
    }
});

Router.route('/load', {
    waitOn: function(){
        return Meteor.subscribe('user_contracts');
    },

    data: function(){
        return {
            contracts: GLOBS.CONTRACTS.find({ user_id: Meteor.userId() })
        };
    }
});

Router.route('/contract/:cid/generate', {
    template: 'contract',

    waitOn: function(){
        return Meteor.subscribe('user_contracts');
    },

    data: function(){
        var c = GLOBS.CONTRACTS.findOne(this.params.cid);
        
        if (c.fee && c.deposit){
            c.deposit_amount = c.fee / 2;
        }

        if (c.fee || c.rate){
            c.fee_or_rate = true;
        }

        return {
            contract: c
        };
    }
});

Tracker.autorun(function(){
    if (!Meteor.user()){
        Router.go('/');
    }
});
