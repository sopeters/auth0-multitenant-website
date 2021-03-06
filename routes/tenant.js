var dotenv = require('dotenv');
var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var router = express.Router();

dotenv.load();

function buildTenants (req) {  
  var groups = req.user._json[`http://${process.env.ROOT_DOMAIN}:${process.env.PORT}/claims/groups`]

  return groups.map(tenant => {
    return {
      name: tenant,
      url: `http://${tenant}.${process.env.ROOT_DOMAIN}:${process.env.PORT}/user`
    };
  });
}

/* GET tenant chooser page */
router.get('/choose', 
  ensureLoggedIn(), 
  function(req, res, next) {
    res.render('select_tenant', { 
      user: req.user, 
      tenants: buildTenants(req),
      title: 'Choose a tenant',
      message: "Oh no! I can't figure out where to send you.  Please tell me where you want to go."
    });
  });

/* GET user unauthorized for tenant page */
router.get('/unauthorized', 
  ensureLoggedIn(), 
  function(req, res, next) {
    res.render('select_tenant', { 
      user: req.user, 
      tenants: buildTenants(req),
      title: 'Unauthorized',
      message: "Sorry, you're not authorized to access that tenant. Please choose another."
    });
  });

module.exports = router;
