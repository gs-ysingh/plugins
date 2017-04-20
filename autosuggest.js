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
        if(this.model.data.length > 0) {
            this.elements.forEach(function (item, index) {
                var ele = this.getTemplate(this.model.data);
                item.parentNode.insertBefore(ele, item.nextSibling);
            }, this);
        }
    }

    init.prototype.filter = function (value) {
        return this.model.data.filter(function (item) {
           return item.toLowerCase().indexOf(value.toLowerCase()) != -1;
        });
    }

    init.prototype.bindEvents = function () {
        this.elements.forEach(function (item) {
            var self = this;
            //Filter the auto suggest
            item.addEventListener('keyup', function (evt) {
                var filteredData = self.filter(evt.target.value);
                var ele = self.getTemplate(filteredData);
                this.parentElement.getElementsByClassName('autosuggest')[0].remove();
                this.parentNode.insertBefore(ele, this.nextSibling);
                this.parentElement.getElementsByClassName('autosuggest')[0].style.display = 'block';
            });

            //Selection from result
            var parentNode = item.parentNode;
            parentNode.addEventListener('click', function (evt) {
                if(evt.target.nodeName == 'LI') {
                    item.value = evt.target.textContent;
                }
            });

        }, this);

        //hide the element
        var that = this;
        window.addEventListener('click', function () {
            that.elements.forEach(function (item) {
                item.parentElement.getElementsByClassName('autosuggest')[0].style.display = 'none';
            });
        });
    }

    function init(options) {
        this.model = options;
        this.defaultConfig = {
            minChar: 0,
            maxItems: 50,
            time: 500,
        };
        this.elements = [].slice.call(getElement(this.model.element));
        
        this.render();
        this.bindEvents();
    }

    return {
        autosuggest: autosuggest
    }
})();