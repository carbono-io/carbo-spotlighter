(function () {

    // CONSTANTS
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var CARBO_SPOTLIGHTER_NS = 'carbo_spotlghter_';

    Polymer({
        is: 'carbo-spotlighter',

        properties: {
            padding: {
                type: Number,
                notify: true,
                value: 5,
            }
        },

        /**
         * Sets apertures according to boundingBoxes
         * @param {Array[BoundingRect]} boundingRects
         */
        setTargetBoundingRects: function (boundingRects) {
            this.unsetTarget();
            
            // create a group
            var apertureGroup = _createApertureGroup.call(this, boundingRects);

            // append to the mask
            this.$.mask.appendChild(apertureGroup);

            // save reference to active apertureGroup
            this.set('currentApertureGroup', apertureGroup);
        },

        /**
         * Sets the target elements to be spotlighted.
         * @param {String|Array|NodeList} elements
         */
        setTargetElements: function (elements) {

            // convert elements into an elements array
            if (typeof elements === 'string') {
                // elements is a CSSSelector
                elements = document.querySelectorAll(elements);

                // convert into array
                elements = Array.prototype.slice.call(elements, 0);

            } else if (!_.isArray(elements)) {
                // probably NodeList
                // https://developer.mozilla.org/en/docs/Web/API/NodeList
                elements = Array.prototype.slice.call(elements, 0);
            }


            // get bounding rects
            var boundingRects = elements.map(function (element) {
                return element.getBoundingClientRect();
            }.bind(this));

            this.setTargetBoundingRects(boundingRects);
        },

        unsetTarget: function () {
            // remove current active group
            if (this.currentApertureGroup) {
                this.$.mask.removeChild(this.currentApertureGroup);
                this.set('currentApertureGroup', false);
            }
        },

        hide: function () {
            Polymer.Base.toggleClass('hidden', true, this.$.wrapper);
        },

        show: function () {
            Polymer.Base.toggleClass('hidden', false, this.$.wrapper);
        },
    });

    /**
     * Auxiliary functions
     */
    function _createAperture(boundingRect) {
        var aperture = document.createElementNS(SVG_NS, 'rect');

        var padding = this.padding;

        aperture.setAttribute('x', boundingRect.left - padding);
        aperture.setAttribute('y', boundingRect.top - padding);
        aperture.setAttribute('width', boundingRect.right - boundingRect.left + 2 * padding);
        aperture.setAttribute('height', boundingRect.bottom - boundingRect.top + 2 * padding);

        return aperture;
    }

    function _createApertureGroup(boundingRects) {
        var group = document.createElementNS(SVG_NS, 'g');
        group.setAttribute('id', _.uniqueId(CARBO_SPOTLIGHTER_NS));

        boundingRects.forEach(function (rect) {

            group.appendChild(_createAperture.call(this, rect));

        }.bind(this));

        return group;
    }

})();