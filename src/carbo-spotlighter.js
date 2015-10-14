(function () {

    // CONSTANTS
    var SVG_NS               = 'http://www.w3.org/2000/svg';
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
            this.set('_currentApertureGroup', apertureGroup);

            return this;
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

            return this;
        },

        /**
         * Destroys the target highlighters
         */
        unsetTarget: function () {

            var _currentApertureGroup = this.get('_currentApertureGroup');

            // remove current active group
            if (_currentApertureGroup) {
                this.$.mask.removeChild(_currentApertureGroup);
                this.set('_currentApertureGroup', false);
            }

            return this;
        },

        /**
         * Hides the spotlighter
         */
        hide: function () {
            Polymer.Base.toggleClass('hidden', true, this.$.wrapper);

            return this;
        },

        /**
         * Shows the spotlighter
         */
        show: function () {
            Polymer.Base.toggleClass('hidden', false, this.$.wrapper);

            return this;
        },
    });

    /**
     * Auxiliary functions
     */
    
    /**
     * Creates and aperture rectangle
     */
    function _createAperture(boundingRect) {
        var aperture = document.createElementNS(SVG_NS, 'rect');

        var padding = this.padding;

        aperture.setAttribute('x', boundingRect.left - padding);
        aperture.setAttribute('y', boundingRect.top - padding);
        aperture.setAttribute('width', boundingRect.width + 2 * padding);
        aperture.setAttribute('height', boundingRect.height + 2 * padding);

        return aperture;
    }

    /**
     * Creates a group of aperture svg elements
     * from an array of boundingRects
     * @param  {Array[BoundingRect]} boundingRects 
     *         The bounding rect must have top, left, width & height
     * @return {SVG g element}
     */
    function _createApertureGroup(boundingRects) {
        var apertureGroup = document.createElementNS(SVG_NS, 'g');
        apertureGroup.setAttribute('id', _.uniqueId(CARBO_SPOTLIGHTER_NS));

        boundingRects.forEach(function (rect) {

            apertureGroup.appendChild(_createAperture.call(this, rect));

        }.bind(this));

        return apertureGroup;
    }

})();