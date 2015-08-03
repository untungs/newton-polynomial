var currentCols = function () {
    'use strict';
    return document.getElementById('row_i').childElementCount - 1;
};

function addColumns(start, n) {
    'use strict';
    
    var th, td, i;

    for (i = start; i < start + n; i += 1) {
        th = document.createElement('th');
        th.appendChild(document.createTextNode(i));
        document.getElementById('row_i').appendChild(th);

        td = document.createElement('td');
        td.appendChild(document.createElement('input'));
        td.firstChild.id = 'x_' + i;
        document.getElementById('row_x').appendChild(td);
        
        td = document.createElement('td');
        td.appendChild(document.createElement('input'));
        td.firstChild.id = 'y_' + i;
        document.getElementById('row_y').appendChild(td);
    }
}

function createFddTable(points, fdd) {
    'use strict';
    
    var table, thead, tbody, tr, th, td,
        i, j;

    table = document.createElement('table');
    
    // create header
    thead = table.createTHead();
    tr    = thead.insertRow();
    tr.innerHTML = '<th>`i`</th><th>`x_i`</th><th>`f(x_i)`</th>';
    for (i = 1; i < fdd.length; i += 1) {
        th = document.createElement('th');
        th.appendChild(document.createTextNode('Orde ke-' + i));
        tr.appendChild(th);
    }

    // create rows
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
    for (i = 0; i < fdd.length; i += 1) {
        tr = tbody.insertRow();

        td = tr.insertCell();
        td.appendChild(document.createTextNode(i));

        td = tr.insertCell();
        td.appendChild(document.createTextNode(points[i].x));

        for (j = 0; j < fdd.length; j += 1) {
            td = tr.insertCell();
            td.innerHTML = fdd[i][j] !== undefined ? fdd[i][j] : '&nbsp;';
        }
    }

    return table;
}

function writeSolution() {
    'use strict';
    
    var i, x, y, xi, order, box, p;
    
    box   = document.getElementById('solution');
    xi    = parseFloat(document.getElementById('cari_x').value);
    order = parseInt(document.getElementById('orde').value, 10);
    i     = 0;
    
    NewtonInt.reset();
    while (document.getElementById('x_' + i)) {
        x = parseFloat(document.getElementById('x_' + i).value);
        y = parseFloat(document.getElementById('y_' + i).value);
        NewtonInt.addPoint(x, y);
        i += 1;
    }
    NewtonInt.calc(xi, order + 1);
    
    box.innerHTML = '';
    box.appendChild(createFddTable(NewtonInt.points(), NewtonInt.fdd()));
    
    p = document.createElement('p');
    p.appendChild(document.createTextNode(NewtonInt.genF(NewtonInt.order())));
    box.appendChild(p);
    
    p = document.createElement('p');
    p.appendChild(document.createTextNode('`f_' + NewtonInt.order() + '(' + xi + ') = ' +
                                          NewtonInt.yint(NewtonInt.order()) + '`'));
    box.appendChild(p);

    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

window.onload = function () {
    'use strict';
    
    addColumns(currentCols(), 4);

    document.getElementById('polynom').addEventListener('click', function (e) {
        writeSolution();
    });
};