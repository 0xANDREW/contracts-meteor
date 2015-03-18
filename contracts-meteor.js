var MONTH_NAMES = [ "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ];

var Contracts = new Mongo.Collection('contracts');

if (Meteor.isClient){
    Session.set('current_template', 'form');

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
                Contracts.update(cid , attrs);
            }
            else {
                Contracts.insert(attrs);
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
            var obj = Contracts.findOne({ _id: cid });
            
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
                return Contracts.findOne({ _id: cid });
            }
            
            return {};            
        }
    });

    Template.contract.helpers({

        // Load contract
        contract: function(){
            var cid = Session.get('cid');

            if (cid){
                var rv = Contracts.findOne({ _id: cid });
                var date = Date.parse(rv.date);

                // Add date components
                rv.day = date.getDate();
                rv.month = MONTH_NAMES[date.getMonth()];
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
            return Contracts.find({});
        }
    });

    Template.load.events({

        // Load contract
        'click .load': function(e){
            var cid = $(e.target).parents('.row').attr('id');

            Session.set('cid', cid);
            Session.set('current_template', 'form');
        },

        // Go back, unset cid
        'click #back': function(e){
            Session.set('cid', null);
            Session.set('current_template', 'form');
        },

        // Delete contract
        // TODO: confirmation
        'click .delete': function(e){
            var cid = $(e.target).parents('.row').attr('id');

            Contracts.remove(cid);
        },

        // Copy contract and load
        'click .copy': function(e){
            var cid = $(e.target).parents('.row').attr('id');

            var contract = Contracts.findOne(cid);
            delete contract._id;
            contract.title += ' copy';

            Session.set('cid', Contracts.insert(contract));
            Session.set('current_template', 'form');
        }
    });

    Template.body.helpers({

        // Set current template name for session
        current_template: function(){
            return Session.get('current_template');
        }
    });
}
