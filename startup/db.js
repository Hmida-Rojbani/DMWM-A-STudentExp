const config = require('config');
require('../db/connection')(config.get('db.prot')+config.get('db.coord')+config.get('db.path'))
