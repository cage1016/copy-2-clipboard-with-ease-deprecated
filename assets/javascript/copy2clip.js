'use strict';


var Copy2clip = function () {
};

Copy2clip.prototype.set = function (key, value) {
    /* if the value is an object, stringify it to save it in localStorage */
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
};

Copy2clip.prototype.setPattern = function (value) {
    this.set('pattern', value);
};

Copy2clip.prototype.setActions = function (value) {
    this.set('actions', value);
};

Copy2clip.prototype.setShortcutEnabled = function (value) {
    this.set('shortcutEnabled', value);
};

Copy2clip.prototype.get = function (key) {
    var data;

    if (!this.hasData(key)) {
        return false;
    }

    data = localStorage[key];

    /* if the data is JSON, try to parse */
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
};


Copy2clip.prototype.save = function (objects) {
    for (var key in objects) {
        this.set(key, objects[key]);
    }
};

Copy2clip.prototype.hasData = function (key) {
    return !!localStorage[key] && !!localStorage[key].length;
};


Copy2clip.prototype.getActions = function (filter) {
    if (filter) {
        return this.get('actions').filter(filter);
    } else {
        return this.get('actions');
    }
};

Copy2clip.prototype.getActionById = function (actionId) {
    var actionFilter = function (action) {
        return action.id === actionId;
    };

    var actions = this.getActions(actionFilter);
    if (actions.length) {
        return actions[0];
    } else {
        return null;
    }
};

Copy2clip.prototype.getDefaultAction = function () {
    var actionFilter = function (action) {
        return action.default;
    };

    var actions = this.getActions(actionFilter);
    if (actions.length) {
        return actions[0];
    } else {
        return null;
    }
};


Copy2clip.prototype.getPattern = function () {
    return this.get('pattern');
};

Copy2clip.prototype.getVersion = function () {
    return this.get('version');
};

Copy2clip.prototype.getPreviewData = function () {
    return this.get('previewData');
};

Copy2clip.prototype.getShortcutEnabled = function () {
    return this.get('shortcutEnabled');
};

Copy2clip.prototype.getResetData = function () {
    return this.get('resetData');
};


Copy2clip.prototype.toCp2 = function () {
    return {
        'pattern': this.getPattern(),
        'actions': this.getActions(),
        'version': this.getVersion(),
        'previewData': this.getPreviewData(),
        'shortcutEnabled': this.getShortcutEnabled()
    };
};

module.exports = new Copy2clip();
