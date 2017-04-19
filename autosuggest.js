/**
 * Created by YSingh on 15/04/17.
 */


var yog = (function () {
    function autosuggest(options) {
        if(isValid(options)) {
            return new init(options);
        }
    }

    function isValid(options) {
        if(!validateElement(options.element)) {
            return false;
        }

        if(!options.data && !options.ajaxRequest) {
            return false;
        }
        return true;
    }

    function getElement(ele) {
        var res;

        if(!ele) {
            console.warn('Element not present in page');
            return false;
        }

        if(typeof ele == 'string') {
            res = document.querySelectorAll(ele);
        }
        else if(ele.length) {
            res = ele;
        }
        else {
            res = [ele];
        }

        if(res.length == 0) {
            console.warn('Element not present in page');
            return false;
        }

        return res;
    }

    function validateElement(ele) {
        if(typeof ele == 'undefined') {
            console.warn("Please provide valid element");
            return false;
        }

        ele = getElement(ele);

        if(!ele) {
            return false;
        }

        return true;
    }

    init.prototype.getTemplate = function (data) {
        var template = '';
        data.forEach(function (item) {
            template +=  '<li>' +  item + '</li>';
        });
        var ele = document.createElement('div');
        var ulEle = document.createElement('ul');
        ulEle.innerHTML = template;
        ele.appendChild(ulEle);
        ele.className = "autosuggest";
        return ele;
    }
    
    init.prototype.render = function () {
        if(this.config.data.length > 0) {
            this.elements.forEach(function (item, index) {
                var ele = this.getTemplate(this.config.data);
                item.parentNode.insertBefore(ele, item.nextSibling);
            }, this);
        }
    }

    init.prototype.filter = function (value) {
        return this.config.data.filter(function (item) {
           return item.indexOf(value) != -1;
        });
    }

    init.prototype.bindEvents = function () {
        this.elements.forEach(function (item) {
            var self = this;
            item.addEventListener('keyup', function (evt) {
                var filteredData = self.filter(evt.target.value);
                var ele = self.getTemplate(filteredData);
                this.parentElement.getElementsByClassName('autosuggest')[0].remove();
                this.parentNode.insertBefore(ele, this.nextSibling);
            });
        }, this);
    }

    function init(options) {
        this.config = options;
        this.defaultConfig = {
            minChar: 0,
            maxItems: 50,
            time: 500,
        };
        this.elements = [].slice.call(getElement(this.config.element));
        
        this.render();
        this.bindEvents();
    }

    return {
        autosuggest: autosuggest
    }
})();