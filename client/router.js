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
        return Meteor.subscribe('contract', this.params.cid);
    },

    data: function(){
        return {
            contract: GLOBS.CONTRACTS.findOne(this.params.cid)
        };
    }
});

Tracker.autorun(function(){
    if (!Meteor.user()){
        Router.go('/');
    }
});
