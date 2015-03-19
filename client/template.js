Template.form.events({
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

        if (this._id){
            Meteor.call('update_contract', this._id, attrs);
        }
        else {
            Meteor.call('new_contract', attrs, function(err, new_cid){
                Router.current().redirect(s.sprintf('/contract/%s', new_cid));
            });
        }
    },

    'click #clear': function(e){
        _.each(Template.instance().$('input, textarea'), function(el){
            $(el).val('').prop('checked', false);
        });

        Router.current().redirect('/');
    }
});

Template.form.rendered = function(){

    // Set up datepicker
    this.$('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    if (this.data.contract._id){
        var obj = GLOBS.CONTRACTS.findOne(this.data.contract._id);
        
        // Set checkbox status
        this.$('#ownership').prop('checked', obj.ownership);
    }
};

// Show print dialog automatically
Template.contract.rendered = function(){
    window.print();
};

Template.contract.events({

    // When displaying print view, single-click goes back
    'click': function(e){
        Router.current().redirect(s.sprintf('/contract/%s', this._id));
    }
});

Template.load.events({

    // Delete contract
    'click .delete': function(e){
        var cid = $(e.target).parents('.row').attr('id');

        if (window.confirm('Delete?')){
            Meteor.call('remove_contract', cid);
        }
    },

    // Copy contract and load
    'click .copy': function(e){
        var cid = $(e.target).parents('.row').attr('id');

        var contract = GLOBS.CONTRACTS.findOne(cid);
        delete contract._id;
        contract.title += ' copy';

        Meteor.call('new_contract', contract);
    }
});
