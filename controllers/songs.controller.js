'use strict';
var send = require("../configs/response.conf");
var conf = require("../configs/app.conf");
var lib = require("../utils/lib");
let console = conf.console;


module.exports = {
	read, update,
}

/**
 * Read songs list
 * @param {*} req 
 * @param {*} res 
 */
function read(req, res) {
	(async _ => {
		let skip = 0, query = {}, sort = { title: 1 };
		if (!isNaN(req.query.page) && Number(req.query.page) > 1)
			skip = (Number(req.query.page) - 1) * conf.limits.songs;
		if (req.query.title)
			query.title = req.query.title;
		if (req.query.sort)
			sort = { [req.query.sort]: 1 };
		if (req.query.dir == "dsc")
			for (let i in sort)
				sort[i] = -1;
		let cursor = conf.collections.songs.find(query);
		let total = await cursor.count();
		let data = await cursor.sort(sort).skip(skip).limit(conf.limits.songs).project({ _id: 0 }).toArray();
		send.ok(res, { total: total, data: data });
	})().catch(err => {
		console.error(err);
		send.serverError(res);
	});
}

/**
 * Updatde song details
 * @param {*} req 
 * @param {*} res 
 */
function update(req, res) {
	(async _ => {
		if (!req.query.id)
			return send.invalidReq(res);
		let query = { id: req.query.id };
		let data = {};
		let rating = Number(req.body.rating);
		if (rating && rating >=1 && rating <= 5)
			data.rating = rating;
		else
			return send.invalidReq(res);
		await conf.collections.songs.updateOne(query, { $set: data });
		send.ok(res);
	})().catch(err => {
		console.error(err);
		send.serverError(res);
	});
}