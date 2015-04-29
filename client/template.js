FlashMessages.configure({
    autoHide: false
});

Template.form.events({
    'click #save': function(e){
        var attrs = {};

        // Iterate through input fields and set object attributes
        _.each(Template.instance().$('input, textarea'), function(el){
            var $el = $(el);
            var val = $el.val();
            var id = $el.attr('id');

            if ($el.is(':checkbox')){
                attrs[id] = $el.prop('checked');
            }
            else {

                // Set empty values to null
                if (val.length){
                    attrs[id] = val;
                }
                else {
                    attrs[id] = null;
                }
            }
        });

        if (this._id){
            Meteor.call('update_contract', this._id, attrs, function(err){
                if (err){
                    FlashMessages.sendError(err.reason.reason);
                }
                else {
                    FlashMessages.clear();
                }
            });
        }
        else {
            Meteor.call('new_contract', attrs, function(err, new_cid){
                if (err){
                    FlashMessages.sendError(err.reason.reason);
                }
                else {
                    FlashMessages.clear();
                    Router.go(s.sprintf('/contract/%s', new_cid));
                }
            });
        }
    },

    'click #clear': function(e){
        _.each(Template.instance().$('input, textarea'), function(el){
            $(el).val('').prop('checked', false);
        });

        FlashMessages.clear();
        Router.go('/');
    },

    'click #autofill': function(e){
        _.each(Template.instance().$('input, textarea'), function(el){
            var $el = $(el);
            var id = $el.attr('id');

            if (id == 'rate' || id == 'fee'){
                $el.val(100);
            }
            else if (id == 'date' || id == 'timeout'){
                $el.val('2015-02-02');
            }
            else if (id != 'user_id'){
                $el.val($el.attr('id'));
            }
        });
    }
});

Template.form.onRendered(function(){

    // Set up datepicker
    this.$('.datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    if (this.data.contract){
        
        // Set checkbox status
        this.$('#ownership').prop('checked', this.data.contract.ownership);
        this.$('#post_support').prop('checked', this.data.contract.post_support);
        this.$('#deposit').prop('checked', this.data.contract.deposit);
    }
});

Template.contract.events({

    // When displaying print view, single-click goes back
    'click': function(e){
        Router.go(s.sprintf('/contract/%s', this._id));
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

Template.registerHelper('pretty_date', function(date){
    if (date){
        return date.toString('yyyy-MM-dd');
    }

    return '';
});

Template.registerHelper('day_helper', function(date){
    if (date){
        return date.getDate();
    }

    return '';
});

Template.registerHelper('month_helper', function(date){
    if (date){
        return GLOBS.MONTH_NAMES[date.getMonth()];
    }

    return '';
});

Template.registerHelper('year_helper', function(date){
    if (date){
        return date.getFullYear();
    }

    return '';
});
