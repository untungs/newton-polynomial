var banyakKolom = function () {
        return document.getElementById('row_i').childElementCount - 1; // <th> tidak ikut dihitung
    },
    dataX = [], // data points on x axis
    dataY = [], // data points on y axis
    fdd = [], // finite divided-difference table
    yint = [], // computed y axis on nth-order interpolating polynomial
    ea = []; // estimated error


function tambahKolom(awal, n) {
    var row_i = document.getElementById('row_i'),
        row_x = document.getElementById('row_x'),
        row_y = document.getElementById('row_y');

    for (var i = awal; i < awal+n; i++) {
        var newth = document.createElement('th');
        newth.appendChild(document.createTextNode(i));
        row_i.appendChild(newth);

        var newtdx = document.createElement('td');
        newtdx.appendChild(document.createElement('input'));
        newtdx.firstChild.id = 'x_' + i;
        row_x.appendChild(newtdx);
        
        var newtdy = document.createElement('td');
        newtdy.appendChild(document.createElement('input'));
        newtdy.firstChild.id = 'y_' + i;
        row_y.appendChild(newtdy);
    }
}

function updateData() {
    dataX = [];
    dataY = [];
    for (var i = 0; i < banyakKolom(); i++) {
        dataX.push(parseFloat(document.getElementById('x_' + i).value));
        dataY.push(parseFloat(document.getElementById('y_' + i).value));
    }
}

function tulisSolusi(orde, x) {
    var box = document.getElementById('solution');
    
    buatTabel(orde);
    
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('f(' + x + ') = ' + yint[yint.length-1]));
    box.appendChild(p);
    
    function buatTabel(orde) {
        var tbl = document.createElement('table'),
            thead = tbl.createTHead(),
            trh = thead.insertRow(),
            th,
            tbody = document.createElement('tbody'),
            tr,
            td;

        // create header
        trh.innerHTML = '<th>i</th><th>x<sub>i</sub></th><th>f(x<sub>i</sub>)</sub>';
        for (var i = 1; i <= orde; i++) {
            th = document.createElement('th');
            th.appendChild(document.createTextNode('Orde ke-' + i));
            trh.appendChild(th);
        }

        // create rows
        tbl.appendChild(tbody);
        for (var i = 0; i <= orde; i++) {
            tr = tbody.insertRow();

            td = tr.insertCell();
            td.appendChild(document.createTextNode(i));

            td = tr.insertCell();
            td.appendChild(document.createTextNode(dataX[i]));

            for (var j = 0; j <= orde; j++) {
                td = tr.insertCell();
                td.innerHTML = fdd[i][j] !== undefined ? fdd[i][j] : '';
            }
        }

        box.appendChild(tbl);
    }
}

/*
    @param x: array data yg diketahui pada sumbu x
    @param y: array data yg diketahui pada sumbu y
    @param n: banyaknya titik data
    @param xi: data yang dicari pada sumbu x
*/
function NewtonInt(x, y, n, xi) {
    var orde = banyakKolom() - 1;
    
    // reset
    fdd = [],
    yint = [],
    ea = [];
    
    // kolom 1: y
    for (var i = 0; i < n; i++) {
        var line = [y[i]];
        fdd.push(line);
    }
  
    // kolom 2: orde ke-1, kolom 3: orde ke-2, dst
    for (var j = 1; j < n; j++) {
        for (var i = 0; i < n-j; i++) {
            fdd[i][j] = (fdd[i+1][j-1] - fdd[i][j-1]) / (x[i+j] - x[i]);
        }
    }
    
    var xterm = 1;
    yint[0] = fdd[0][0];
  
    for (var o = 1; o < n; o++) {
        xterm = xterm * (xi - x[o-1]);
        var yint2 = yint[o-1] + fdd[0][o] * xterm;
        ea[o-1] = yint2 - yint[o-1];
        yint[o] = yint2;
    }
    console.log(fdd);
    console.log(yint);
    console.log(ea);
    
    tulisSolusi(orde, xi);
}

window.onload = function() {
    tambahKolom(banyakKolom(), 4);

    // attach event
    for (var i = 0; i < banyakKolom(); i++) {
        document.getElementById('x_' + i).onchange = function() {
            updateData();
        }
        document.getElementById('y_' + i).onchange = function() {
            updateData();
        }
    }
    document.getElementById('polynom').addEventListener('click', function (e) {
      var xi = document.getElementById('cari_x').value;
      NewtonInt(dataX, dataY, banyakKolom(), xi);
    });
}