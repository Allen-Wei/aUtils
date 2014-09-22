



(function($) {
    if (!window.aUtils) window.aUtils = {};

    aUtils.RadGridClient = function(arg1) {
        this.clientId = '';
        this.table = undefined;
        this.masterTable = undefined;
        if (arg1 && arg1.indexOf) {
            this.clientId = arg1;
        } else {
            this.table = arg1;
        }

        this.InitTable = function(identity) {
            //this.clientId = $('[id$=' + identity + ']').attr('id');
            if (identity) this.clientId = identity;
            this.table = $find(this.clientId);
            return this;
        };
        //will expire
        this.MastTable = function() {
            if (!this.table) this.InitTable();
            if (this.table) return this.table.get_masterTableView();
            else return undefined;
        };
        this.InitMasterTable = function() {
            if (!this.table) this.InitTable();
            if (this.table) this.masterTable = this.table.get_masterTableView();
            else this.masterTable = undefined;
        };
        this.Rebind = function() {
            if (!this.masterTable) this.InitMasterTable();
            try {
                if (this.masterTable) {
                    this.masterTable.rebind();
                } else {
                    console.log('radgrid bind fail');
                }
            } catch (ex) {
                console.log(ex.message);
            }
            return this;
        }
    };

})(jQuery);


var RadGridClient = function (arg1) {
    this.clientId = '';
    this.table = undefined;
    this.masterTable = undefined;
    if (arg1 && arg1.indexOf) {
        this.clientId = arg1;
    } else {
        this.table = arg1;
    }

    this.InitTable = function (identity) {
        //this.clientId = $('[id$=' + identity + ']').attr('id');
        if (identity) this.clientId = identity;
        this.table = $find(this.clientId);
        return this;
    };
    //will expire
    this.MastTable = function () {
        if (!this.table) this.InitTable();
        if (this.table) return this.table.get_masterTableView();
        else return undefined;
    };
    this.InitMasterTable = function () {
        if (!this.table) this.InitTable();
        if (this.table) this.masterTable = this.table.get_masterTableView();
        else this.masterTable = undefined;
    };
    this.Rebind = function () {
        if (!this.masterTable) this.InitMasterTable();
        try {
            if (this.masterTable) {
                this.masterTable.rebind();
            } else {
                console.log('radgrid bind fail');
            }
        } catch (ex) { console.log(ex.message); }
        return this;
    }
};
