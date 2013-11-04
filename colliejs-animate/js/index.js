// Load the logo.png image

var ua = navigator.userAgent.toLowerCase(),
    isIE6  = /msie\s+6\.0/.test(ua),
    png8folder = "png8/"


	if(!isIE6){
		png8folder = "" ;
	}

    collie.ImageManager.add({
        "greenbox_bw":"./images/" + png8folder +"green_box_blowout.png",
        "bluebox_bw":"./images/" + png8folder +"blue_box_blowout.png",
        "redbox_bw":"./images/" + png8folder +"red_box_blowout.png",

        "green_wobble":"./images/" + png8folder +"green_wobble.png",
        "blue_wobble":"./images/" + png8folder +"blue_wobble.png",
        "red_wobble":"./images/" + png8folder +"red_wobble.png",

        "show":"./images/" + png8folder +"show.png"
    },function(){
		// Create a layer
		var layer = new collie.Layer({
		    width : 1200,
		    height : 2000
		});
		 

		var greenbox_bw = new collie.DisplayObject({
		    x : 300,
		    y : 300,
		    width: 500,
		    height: 500,
		    backgroundImage: "greenbox_bw"
		}).addTo(layer);


		collie.Timer.cycle(greenbox_bw, 500, {
		    from: 0,
		    to: 7,
		    loop: 1
		});


		var bluebox_bw = new collie.DisplayObject({
		    x : 200,
		    y : 200,
		    width: 500,
		    height: 500,
		    backgroundImage: "bluebox_bw"
		}).addTo(layer);

		collie.Timer.cycle(bluebox_bw, 500, {
		    from: 0,
		    to: 7,
		    loop: 1
		});

		var redbox_bw = new collie.DisplayObject({
		    x : 400,
		    y : 400,
		    width: 500,
		    height: 500,
		    backgroundImage: "redbox_bw"
		}).addTo(layer);

		collie.Timer.cycle(redbox_bw, 500, {
		    from: 0,
		    to: 7,
		    loop: 1
		});

		var show = new collie.DisplayObject({
		    x : 30,
		    y : 700,
		    width: 800,
		    height: 400,
		    backgroundImage: "show"
		}).addTo(layer);

		collie.Timer.cycle(show, 3000, {
		    from: 0,
		    to: 14,
		    loop: 0
		});

		var green_wobble = new collie.DisplayObject({
		    x : 500,
		    y : 900,
		    width: 200,
		    height: 200,
		    backgroundImage: "green_wobble"
		}).addTo(layer);

		collie.Timer.cycle(green_wobble, 2000, {
		    from: 0,
		    to: 4,
		    loop: 0
		});


		// show
		// Add a layer to renderer
		collie.Renderer.addLayer(layer);
		 
		// Retrieve renderer from the container ID element
		collie.Renderer.load(document.getElementById("container"));

		// Start rendering
		setTimeout(function(){
			collie.Renderer.start();
		},2000)

    });


 

