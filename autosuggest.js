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
    
    init.prototype.render = function () {
        var elements = [].slice.call(getElement(this.config.element));

        if(this.config.data.length > 0) {
            var template = '';
            this.config.data.forEach(function (item) {
                template +=  '<li>' +  item + '</li>';
            });

            var ele = document.createElement('ul');
            ele.innerHTML = template;

            elements.forEach(function (item) {
               item.parentNode.insertBefore(ele, item);
            });
        }
    }

    function init(options) {
        this.config = options;
        this.defaultConfig = {
            minChar: 0,
            maxItems: 50,
            time: 500,
        };
        
        this.render();
        this.bindEvents();
    }

    return {
        autosuggest: autosuggest
    }
})();