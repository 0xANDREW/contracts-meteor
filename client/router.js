Router.configure({
    layoutTemplate: 'wrapper'
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

Router.route('/contract/:cid', function(){
    this.render('form', {
        data: {
            contract: GLOBS.CONTRACTS.findOne(this.params.cid)
        }
    });
});

Router.route('/load', function(){
    this.render('load', {
        data: {
            contracts: GLOBS.CONTRACTS.find({})
        }
    });
});

Router.route('/contract/:cid/generate', function(){
    this.render('contract', {
        data: {
            contract: GLOBS.CONTRACTS.findOne(this.params.cid)
        }
    });
});
