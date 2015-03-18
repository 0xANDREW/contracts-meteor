Contracts = new Mongo.Collection('contracts');

if (Meteor.isClient){
    Session.set('current_template', 'form');

    Template.form.events({
        'click #generate': function(e){
            Session.set('current_template', 'contract');
        },

        'click #save': function(e){
            var attrs = {};

            _.each(Template.instance().$('input'), function(el){
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
            _.each(Template.instance().$('input'), function(el){
                $(el).val('').prop('checked', false);
            });
        }
    });

    Template.form.rendered = function(){
        Template.instance().$('.datepicker').datepicker({
            dateFormat: 'yy-mm-dd'
        });
    };

    Template.form.helpers({
        'contract': function(){
            var cid = Session.get('cid');

            if (cid){
                return Contracts.findOne({ _id: cid });
            }
            
            return {};            
        }
    });

    Template.contract.rendered = function(){
        window.print();
    };

    Template.contract.events({
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
        'click .load': function(e){
            var cid = $(e.target).parents('.row').attr('id');

            Session.set('cid', cid);
            Session.set('current_template', 'form');
        },

        'click #back': function(e){
            Session.set('cid', null);
            Session.set('current_template', 'form');
        },

        'click .delete': function(e){
            var cid = $(e.target).parents('.row').attr('id');

            Contracts.remove(cid);
        },

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
        current_template: function(){
            return Session.get('current_template');
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
