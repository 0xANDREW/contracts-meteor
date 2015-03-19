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
    var rv = GLOBS.CONTRACTS.findOne(this.params.cid);
    var date = Date.parse(rv.date);

    // Add date components
    rv.day = date.getDate();
    rv.month = GLOBS.MONTH_NAMES[date.getMonth()];
    rv.year = date.getFullYear();

    this.render('contract', {
        data: {
            contract: rv
        }
    });
});
