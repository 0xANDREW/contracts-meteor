var schemas = {};

schemas.Contract = new SimpleSchema({
    date: { type: Date },
    title: { type: String },
    your_company: { type: String },
    your_address: { type: String },
    your_email: { type: SimpleSchema.RegEx.Email },
    your_contact: { type: String },
    client_name: { type: String },
    client_address: { type: String },
    client_contact: { type: String },
    client_email: { type: SimpleSchema.RegEx.Email },
    client_resp: { type: String },
    your_resp: { type: String },
    rate: { type: Number, optional: true },
    fee: { type: Number, optional: true },
    time_detail: { type: String, optional: true },
    timeout: { type: Date, optional: true },
    ownership: { type: Boolean },
    user_id: { type: String },
    post_support: { type: Boolean }
});

GLOBS.CONTRACTS.attachSchema(schemas.Contract);
