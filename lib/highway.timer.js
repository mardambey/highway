var Highway = function() 
{
	// Slide status
	Highway.STATUS_AVAIL   = 0; // Download and rendering complete, available as requirement
	Highway.STATUS_UNAVAIL = 1; // Download and rendering incomplete, unavailable	as requirement

	// Slices defined for this page
	this.slices = {};

	// Queue holding slices depending on unavailable ones
	this.queue = {};

	// Hold queued slice ids
	this.queued = {};

	this.getSlice = function(args)
	{
		var slice = new Slice();
		slice.id = args.id;
		slice.url = args.url;
		slice.requires = args.requires;

		this.slices[slice.id] = slice;

		// requires: array of slices this slice depends on
		// if this slice depends on other slices we need to make sure
		// they are all downloaded before we download this slice
		this.attemptLoadSlice(slice);
	}

	this.attemptLoadSlice = function(slice)
	{
		if ((slice.requires == null || this.requirementsMet(slice)) && slice.status == Highway.STATUS_UNAVAIL)
		{
			// load this slice
			this.loadSlice(slice);
			return true;
		}
		else
		{
			// this slice has requirements (other slices)
			// queue it so we can check up on it later
			this.queueSlice(slice);
			return false;
		}

		return true;
	}

	this.tick = function()
	{
		var tickAgain = false;
		for(var id in this.slices)
		{
			var slice = this.slices[id];
			if (slice.status == Highway.STATUS_UNAVAIL)
			{					
				if (!this.attemptLoadSlice(slice)) tickAgain = true;
			}
		}

    if (tickAgain) setTimeout("Highway.tick();", 10);
	}

	this.log = function(msg)
	{
		$("#debug").html($("#debug").html() + msg + "\n");
	}

	this.queueSlice = function(slice)
	{
		if (this.queued[slice.id] == 1) return;

		var len = slice.requires.length;

		for (var i = 0; i < len; i++)
		{	
			var req = slice.requires[i]; // id of required slice
			var slices = this.queue[req];

			if (slices == null)
			{				
				slices = {};
				slices[slice.id] = slice;
				this.queue[req] = slices;
			}
			else
			{
        slices[slice.id] = slice;								
			}
		}

		this.queued[slice.id] = 1;
	}

	this.loadSlice = function(slice)
	{
		this.queued[slice.id] = 1;
		$.get(slice.url, function(data)
		{
			$('#' + slice.id).html(data);
			slice.status = Highway.STATUS_AVAIL;
		});
	}
		/*
		{
		"num_phases":4,
		"roadrunner_enabled":true,
		"id":"first_response",
		"phase":0,
		"is_last":true,
		"tti_phase":1,
		"bootloadable":[],
		"css":["tkh7\/","geUXp","NsjyP","soTqZ","ZJzT5","cVk4w","6xzNu"],
		"js":[],
		"resource_map":[],
		"extern_rsrcs":[],
		"requires":[],
		"provides":[],
		"onload":[],
		"onafterload":[],
		"onpagecache":[],
		"onafterpagecache":[],
		"refresh_pagelets":[],
		"invalidate_cache":[]
		}
		*/

	this.requirementsMet = function(slice)
	{
		var len = slice.requires.length;
		for (var i = 0; i < len; i++)
		{
			if (!this.sliceAvail(slice.requires[i])) return false;
		}

		return true;
	}

	this.sliceAvail = function(slice_id)
	{
		var slice = null;
		if ((slice = this.slices[slice_id]) == null) return false;
		return (slice.status == Highway.STATUS_AVAIL);
	}

	// Slice object
	var Slice = function()
	{
		this.status = Highway.STATUS_UNAVAIL;
		this.id = null;
		this.url = null;
		this.requires = null;
	}

	this.ctor = function()
	{
	}

	this.ctor();
}

Highway.tickers = [];
Highway.tick = function()
	{
		for (var i = 0; i < Highway.tickers.length; i++)
		{
			Highway.tickers[i].tick();
		}
	}

Highway.run = function(highway)
	{
		Highway.tickers.push(highway);
		setTimeout("Highway.tick();", 10);
	}
