
(function($) {
    if (!window.aUtils) window.aUtils = function() {};
    aUtils.XDM = function(targetDoc) {
        this.targetDoc = targetDoc;

        var domain = 'http://' + location.host;
        this.post = function(msg, tDoc) {
            if (tDoc) {
                tDoc.postMessage(msg, domain);
            } else {
                this.targetDoc.postMessage(msg, domain);
            }
        };
        this.resetDoc = function(doc) {
            this.targetDoc = doc;
        }
    };

})(jQuery);