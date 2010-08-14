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

	// Queues a slice for downloading. Download can begin immediately
	// if the slice does not depend on any other slices.
	this.getSlice = function(args)
	{
		var slice = new Slice();
		slice.id = args.id;
		slice.url = args.url;
		slice.requires = args.requires;
		slice.onafterload = args.onafterload;

		this.slices[slice.id] = slice;

		// requires: array of slices this slice depends on
		// if this slice depends on other slices we need to make sure
		// they are all downloaded before we download this slice
		this.attemptLoadSlice(slice);
	}

	// Attempts to load a slice or queues it if the slice has pending
	// requirements that still need downloading.
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

	// Debug method for logging to a dom element with id "debug". 
	// This needs to be moved out of here.
	this.log = function(msg)
	{
		if ($("#debug")) $("#debug").html($("#debug").html() + msg + "\n");
	}

	// Queues a slice for downloading if it has not been queued before.
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

	// Loads a slice by issueing a "GET" ajax request. After the slice
	// loads this method will fire the "fireLoaded" event to possibly 
	// begin downloading slices that depend on this one.
	this.loadSlice = function(slice)
	{
		this.queued[slice.id] = 1;
		t = this;
		$.get(slice.url, function(data)
		{
			$('#' + slice.id).html(data);
			slice.status = Highway.STATUS_AVAIL;
			t.fireLoaded(slice);
			t.fireOnAfterLoadComplete(slice);
		});
	}

	this.fireOnAfterLoadComplete = function(slice)
	{
		for (var i = 0; slice.onafterload && (i < slice.onafterload.length); i++)
		{
			slice.onafterload[i]();
		}
	}

	// This method is called when a slice has finished downloading. If a slice 
	// has dependencies it is possible they begin downloading at this point.
	this.fireLoaded = function(slice)
	{
		this.log(slice.id + " done, trying to fire its dependencies:");

		slices = this.queue[slice.id];
		if (slices == null)
		{
			this.log("   no slices depend on this one!");
			return;
		}
		
		for (var s in slices)
		{
			this.log("   attempting to load dependency: " + s);
			this.attemptLoadSlice(slices[s]);			
		}
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

	// Checks if all the requirements of a slice has been met.
	this.requirementsMet = function(slice)
	{
		var len = slice.requires.length;
		for (var i = 0; i < len; i++)
		{
			if (!this.sliceAvail(slice.requires[i])) return false;
		}

		return true;
	}

	// Checks if a certain slice is available.
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
		this.onafterload = null;
	}

	this.ctor = function()
	{
	}

	this.ctor();
}


