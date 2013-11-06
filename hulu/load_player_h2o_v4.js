var LoadPlayer = {
  createSWFObject: function(cph, default_cpv){
    var so = new SWFObject(LoadPlayer.playerPath(cph, default_cpv), "player", "100%", "100%", "10.1.0");
    so.useExpressInstall("/expressinstall.swf");
    so.setAttribute("style", "z-index:10;");
    so.addParam("allowScriptAccess", "always");
    so.addParam("allowFullscreen", "true");
    so.addParam("bgcolor", "#000000");
    if ($.client.os == "Windows" && $.client.browser == "Safari"){
      so.addParam("wmode", "opaque");
    }
    return so;
  },

  playerVersion: function(default_cpv){
    var cpv = Hulu.Utils.Url.getQueryStringParam("cpv") || 0;
    if ((Hulu.Configuration.env() != "production" || Hulu.Configuration.isSmoke()) && cpv == 0) {
        cpv = default_cpv;
    }
    if (cpv > 0) return cpv;
    try {
        if (Hulu.Donut.getTreatmentByFlight("player") == "") {
            return 205475;
        }
    } catch (e) {}
    return 205475;
  },

  playerPath: function(cph, default_cpv){
    var path = (cph == null || cph == "") ? "/site-player" : cph
    cpv = LoadPlayer.playerVersion(default_cpv);
    if (cpv > 0){
      path += "/" + cpv
    }
    return path + "/" + LoadPlayer.playerName();
  },

  playerName: function(){
    var swfVersion = deconcept.SWFObjectUtil.getPlayerVersion();
    var name = "playerwrapper.swf"
    return name;
  }
}

