require('./custom');

if (document.getElementById('admin_filters')) {
    require('./Filter');
}

if (document.getElementById('admin_affiliate_stats')) {
    require('./AffiliateStats');
}
