if (Meteor.userId()){
    Session.set('current_template', 'form');
}
else {
    Session.set('current_template', 'login');
}

Template.form.events({
    'click #generate': function(e){
        Session.set('current_template', 'contract');
    },

    'click #save': function(e){
        var attrs = {};

        // Iterate through input fields and set object attributes
        _.each(Template.instance().$('input, textarea'), function(el){
            var $el = $(el);

            if ($el.is(':checkbox')){
                attrs[$el.attr('id')] = $el.prop('checked');
            }
            else {
                attrs[$el.attr('id')] = $el.val();
            }
        });

        var cid = Session.get('cid');

        if (cid){
            Meteor.call('update_contract', cid, attrs);
        }
        else {
            Meteor.call('new_contract', attrs, function(err, new_cid){
                Session.set('cid', new_cid);
            });
        }
    },

    'click #load': function(e){
        Session.set('current_template', 'load');            
    },

    'click #clear': function(e){
        _.each(Template.instance().$('input, textarea'), function(el){
            $(el).val('').prop('checked', false);
        });
    }
});

Template.form.rendered = function(){
    var tpl = Template.instance();

    // Set up datepicker
    tpl.$('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    // TODO: there's a better way to do this than querying again
    // template data?
    var cid = Session.get('cid');

    if (cid){
        var obj = GLOBS.CONTRACTS.findOne({ _id: cid });
        
        // TODO: why does this break on reload?
        if (obj){

            // Set checkbox status
            tpl.$('#ownership').prop('checked', obj.ownership);
        }
    }
};

Template.form.helpers({
    contract: function(){
        var cid = Session.get('cid');

        if (cid){
            return GLOBS.CONTRACTS.findOne({ _id: cid });
        }
        
        return {};            
    }
});

Template.contract.helpers({

    // Load contract
    contract: function(){
        var cid = Session.get('cid');

        if (cid){
            var rv = GLOBS.CONTRACTS.findOne({ _id: cid });
            var date = Date.parse(rv.date);

            // Add date components
            rv.day = date.getDate();
            rv.month = GLOBS.MONTH_NAMES[date.getMonth()];
            rv.year = date.getFullYear();

            return rv;
        }
        
        return {};            
    }
});

// Show print dialog automatically
Template.contract.rendered = function(){
    window.print();
};

Template.contract.events({

    // When displaying print view, single-click goes back
    'click': function(e){
        Session.set('current_template', 'form');
    }
});

Template.load.helpers({
    contracts: function(){
        return GLOBS.CONTRACTS.find({});
    }
});

Template.load.events({

    // Load contract
    'click .load': function(e){
        var cid = $(e.target).parents('.row').attr('id');

        Session.set('cid', cid);
        Session.set('current_template', 'form');
    },

    'click #back': function(e){
        Session.set('current_template', 'form');
    },

    // Delete contract
    // TODO: confirmation
    'click .delete': function(e){
        var cid = $(e.target).parents('.row').attr('id');

        Meteor.call('remove_contract', cid);

        // Unset session cid if that's the one being deleted
        if (Session.get('cid') == cid){
            Session.set('cid', null);
        }
    },

    // Copy contract and load
    'click .copy': function(e){
        var cid = $(e.target).parents('.row').attr('id');

        var contract = GLOBS.CONTRACTS.findOne(cid);
        delete contract._id;
        contract.title += ' copy';

        Meteor.call('new_contract', contract, function(err, new_cid){
            Session.set('cid', new_cid);
            Session.set('current_template', 'form');
        });
    }
});

Template.body.helpers({

    // Set current template name for session
    current_template: function(){
        return Session.get('current_template');
    }
});
