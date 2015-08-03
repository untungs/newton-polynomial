/** @module NewtonInt

    Newton’s divided-difference interpolating polynomial
*/
var NewtonInt = (function () {

    'use strict';
    
    /** data of known points */
    var dataPoints = [],
        
        order = 0,
  
    /** finite divided-differences table */
        fdd = [],
    
    /** computed y axis on nth-order polynomial */
        yint = [],
    
    /** estimated errors */
        ea = [];
    
    /**    */
    function addPoint(x, y) {
        dataPoints.push({ x: x, y: y });
    }
    
    /** 
        Calculate the interpolation
        @param {number} xi - x axis of data that is being searched
        @param {number} n - Number of data points, equal to order + 1
    */
    function calc(xi, n) {
        
        var i, j,
            b,
            xterm = 1,
            yint2;
        
        n = n || dataPoints.length;
        order = n - 1;
        
        // 0th order
        for (i = 0; i < n; i += 1) {
            b = [dataPoints[i].y];
            fdd.push(b);
        }
        
        // 1st, 2nd, 3rd, etc orders
        for (j = 1; j < n; j += 1) {
            for (i = 0; i < n - j; i += 1) {
                fdd[i][j] = (fdd[i + 1][j - 1] - fdd[i][j - 1]) / (dataPoints[i + j].x - dataPoints[i].x);
            }
        }
        
        yint[0] = fdd[0][0];

        for (i = 1; i < n; i += 1) {
            xterm = xterm * (xi - dataPoints[i - 1].x);
            yint2 = yint[i - 1] + fdd[0][i] * xterm;
            ea[i - 1] = yint2 - yint[i - 1];
            yint[i] = yint2;
        }
    }
    
    /** */
    function reset() {
        dataPoints = [];
        fdd = [];
        yint = [];
        ea = [];
    }
    
    return {
        points: function () { return dataPoints; },
        fdd:    function () { return fdd; },
        yint:   function (order) { return yint[order]; },
        ea:     function () { return ea; },
        order:  function () { return order; },
        addPoint: addPoint,
        calc: calc,
        reset: reset
    };
}());